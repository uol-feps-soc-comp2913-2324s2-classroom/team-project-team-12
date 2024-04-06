import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';
import type { route, user, group, group_membership, group_route, Path, RouteEntry,groupRouteEntry }  from '$lib/interfaces';

let user: user;
let usernameDict: Map<number, string> = new Map();
let groupnameDict: Map<number, string> = new Map();
let userGroups: group[] = [];
let adminGroups: group[] = [];

let userRoutes: route[] = [];
let userRouteEntries: RouteEntry[] = [];


let friendsRoutes: route[] = [];
let friendsRouteEntries: RouteEntry[] = [];
let userFriendIDs: Number[] = [];

let groupRoutes: route[] = [];
let groupRouteEntries: groupRouteEntry[] = [];


let publicRoutes: route[] = [];
let publicRouteEntries: RouteEntry[] = [];

export const load = async ({ cookies }) => {
    usernameDict.clear();
    userGroups = [];
    adminGroups = [];
    userRoutes = [];
    groupRoutes = [];
    userFriendIDs = [];
    friendsRoutes = [];
    publicRoutes = [];
    userRouteEntries = [];
    friendsRouteEntries = [];
    groupRouteEntries = [];
    publicRouteEntries = [];
    
    // Get the user's login session
    const username = cookies.get('sessionId');

    // Make the user log in before showing routes
    if (username == undefined) throw redirect(302, '/login');

    // Get the user's data
    const userCheck = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (userCheck == null) throw redirect(302, '/login');
    if (userCheck == undefined) throw redirect(302, '/login');
    user = userCheck;

    //Populate username dictionary
    const allUsersList = await prisma.user.findMany();
    for (const user of allUsersList) {
        usernameDict.set(user.id, user.username);
    }

    //Populate groupname dictionary
    const allGroupsList = await prisma.groups.findMany();
    for (const group of allGroupsList) {
        groupnameDict.set(group.id, group.name);
    }

    // Lookup User's Routes
    const usersRoutes = await prisma.routes.findMany({
        where: {
            creator: user.id
        }
    });
    for (const route of usersRoutes) {
        userRoutes.push(route);
    }
    //Create user route entries
    for (const route of userRoutes) {
            if (route.route_name == null) route.route_name = "Unnamed Route";
            if (route.created_on == null) route.created_on = new Date();
            if (route.approximate_completion_time == null) route.approximate_completion_time = 0;
            let routeCoords = await prisma.route_coordinates.findMany({
                where: {
                    route_id: route.id
                }
            });
            //convert route coordinates to path
            let routePath: Path = [];
            for (const coord of routeCoords) {
                routePath.push([Number(coord.latitude), Number(coord.longitude)]);
            }
            let RouteEntryObj: RouteEntry = {
            id: route.id,
            name: route.route_name?.toString(),
            creator: user.username,
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath,
            group: null,
            publicity: route.publicity as number,
            showOnMap: false
        };
        userRouteEntries.push(RouteEntryObj);
    }
    //console.log(userRoutes);
    //console.log(userRouteEntries);


    // Lookup user's friends
    const userFriendRelations = await prisma.relationship.findMany({
        where: {
            OR: [
                {
                    user_id1: user.id,
                    is_friend: true,
                    is_blocked: false
                },
                {
                    user_id2: user.id,
                    is_friend: true,
                    is_blocked: false
                }
            ]
        }
    });
    userFriendIDs = [];
    userFriendRelations.forEach((relation) => {
        if (relation.user_id1 == user.id) userFriendIDs.push(relation.user_id2);
        else userFriendIDs.push(relation.user_id1);
    });

    for (const friendID of userFriendIDs) {
        const friendRoutes = await prisma.routes.findMany({
            where: {
                OR: [
                    {
                    creator: friendID as number,
                    publicity: 2
                    },
                    {
                        creator: friendID as number,
                        publicity: 1
                    }
                ]
            }
        });
        friendsRoutes.push(...friendRoutes);
    }
    //Create friend route entries
    for (const route of friendsRoutes) {
        if (route.route_name == null) route.route_name = "Unnamed Route";
        if (route.created_on == null) route.created_on = new Date();
        if (route.approximate_completion_time == null) route.approximate_completion_time = 0;
        if (route.creator == null) route.creator = 0;
        let routeCoords = await prisma.route_coordinates.findMany({
            where: {
                route_id: route.id
            }
        });
        //convert route coordinates to path
        let routePath: Path = [];
        for (const coord of routeCoords) {
            routePath.push([Number(coord.latitude), Number(coord.longitude)]);
        }
        let RouteEntryObj: RouteEntry = {
            id: route.id,
            name: route.route_name?.toString(),
            creator: usernameDict.get(route.creator as number) || "Unknown",
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath,
            group: null,
            publicity: route.publicity as number,
            showOnMap: false
        };
        friendsRouteEntries.push(RouteEntryObj);
    }

    // Lookup user's groups
    const userGroupsRelations = await prisma.group_membership.findMany({
        where: {
            user_id: user.id,
            member: true
        }
    });
    for (const relation of userGroupsRelations) {
        const group = await prisma.groups.findUnique({
            where: {
                id: relation.group_id
            }
        });
        if (group != null) userGroups.push(group);
    }

    //Find user's admin groups
    const adminGroupsRelations = await prisma.group_membership.findMany({
        where: {
            user_id: user.id,
            admin: true
        }
    });
    for (const relation of adminGroupsRelations) {
        const group = await prisma.groups.findUnique({
            where: {
                id: relation.group_id
            }
        });
        if (group != null) adminGroups.push(group);
    }

    //Lookup group routes
    for (const group of userGroups) {
        const groupRoutesRelations = await prisma.group_routes.findMany({
            where: {
                group_id: group.id
            }
        });
        let groupRouteEntriesList: RouteEntry[] = [];
        for (const routeRelation of groupRoutesRelations) {
            const route = await prisma.routes.findUnique({
                where: {
                    id: routeRelation.route_id
                }
            });
            if (route != null) groupRoutes.push(route);
            if (route != null) {
                if (route.route_name == null) route.route_name = "Unnamed Route";
                if (route.created_on == null) route.created_on = new Date();
                if (route.approximate_completion_time == null) route.approximate_completion_time = 0;
                let routeCoords = await prisma.route_coordinates.findMany({
                    where: {
                        route_id: route.id
                    }
                });
                //convert route coordinates to path
                let routePath: Path = [];
                for (const coord of routeCoords) {
                    routePath.push([Number(coord.latitude), Number(coord.longitude)]);
                }
                let RouteEntryObj: RouteEntry = {
                    id: route.id,
                    name: route.route_name?.toString(),
                    creator: usernameDict.get(route.creator as number) || "Unknown",
                    createdOn: route.created_on,
                    completionTime: route.approximate_completion_time,
                    path: routePath,
                    group: group.name,
                    publicity: route.publicity as number,
                    showOnMap: false
                };
                groupRouteEntriesList.push(RouteEntryObj);
            }
        }
        let groupRouteEntryObj: groupRouteEntry = {
            group_name: group.name,
            routes: groupRouteEntriesList,
            showOnMap: false
        };
        groupRouteEntries.push(groupRouteEntryObj);
    }
    

    //get public routes
    const publicRoutesRelations = await prisma.routes.findMany({
        where: {
            publicity: 2
        }
    });
    for (const route of publicRoutesRelations) {
        publicRoutes.push(route);
    }
    //Create public route entries
    for (const route of publicRoutes) {
        if (route.route_name == null) route.route_name = "Unnamed Route";
        if (route.created_on == null) route.created_on = new Date();
        if (route.approximate_completion_time == null) route.approximate_completion_time = 0;
        if (route.creator == null) route.creator = 0;
        let routeCoords = await prisma.route_coordinates.findMany({
            where: {
                route_id: route.id
            }
        });
        //convert route coordinates to path
        let routePath: Path = [];
        for (const coord of routeCoords) {
            routePath.push([Number(coord.latitude), Number(coord.longitude)]);
        }
        let RouteEntryObj: RouteEntry = {
            id: route.id,
            name: route.route_name?.toString(),
            creator: usernameDict.get(route.creator as number) || "Unknown",
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath,
            group: null,
            publicity: route.publicity as number,
            showOnMap: false
        };
        publicRouteEntries.push(RouteEntryObj);
    }
    //console.log(publicRoutes);
    //console.log(groupnameDict);
    //sort userRoutes by date (descending)
    userRoutes.sort((a, b) => (a.created_on as Date).getTime() - (b.created_on as Date).getTime());
    userRoutes.reverse();
    //sort friendsRoutes by date (descending)
    friendsRoutes.sort((a, b) => (a.created_on as Date).getTime() - (b.created_on as Date).getTime());
    friendsRoutes.reverse();
    //sort groupRoutes by date (descending)
    groupRoutes.sort((a, b) => (a.created_on as Date).getTime() - (b.created_on as Date).getTime());
    groupRoutes.reverse();
    //sort publicRoutes by date (descending)
    publicRoutes.sort((a, b) => (a.created_on as Date).getTime() - (b.created_on as Date).getTime());
    publicRoutes.reverse();

    //remove duplicates from userRoutes
    userRoutes = userRoutes.filter((route, index, self) =>
        index === self.findIndex((t) => (
            t.route_name === route.route_name && t.creator === route.creator
        ))
    );
    //remove duplicates from friendsRoutes
    friendsRoutes = friendsRoutes.filter((route, index, self) =>
        index === self.findIndex((t) => (
            t.route_name === route.route_name && t.creator === route.creator
        ))
    );

    //remove duplicates from publicRoutes
    publicRoutes = publicRoutes.filter((route, index, self) =>
        index === self.findIndex((t) => (
            t.route_name === route.route_name && t.creator === route.creator
        ))
    );

    //console.log(friendsRouteEntries.length);
    //for route in routeslist check if route is in routes to show for user
    const routesToShow = await prisma.routes_to_show.findMany({
        where: {
            user_id: user.id
        }
    });
    for (const route of routesToShow) {
        for (const entry of userRouteEntries) {
            if (entry.id == route.route_id) {
                entry.showOnMap = true;
            }
        }
        for (const entry of publicRouteEntries) {
            if (entry.id == route.route_id) {
                entry.showOnMap = true;
            }
        }
        for (const entry of friendsRouteEntries) {
            if (entry.id == route.route_id) {
                entry.showOnMap = true;
            }
        }
    }

    //for group in groupslist check if group is in groups to show for user
    const groupsToShow = await prisma.groups_to_show.findMany({
        where: {
            user_id: user.id
        }
    });
    for (const group of groupsToShow) {
        for (const entry of groupRouteEntries) {
            if (entry.group_name == groupnameDict.get(group.group_id)) {
                entry.showOnMap = true;
            } else {
                entry.showOnMap = false;
            }
        }
    }


    return {
        props: {
            user: user,
            userRoutes: userRoutes,
            userRouteEntries: userRouteEntries,
            userGroups: userGroups,
            adminGroups: adminGroups,
            groupnameDict: groupnameDict,
            friendsRoutes: friendsRoutes,
            friendsRouteEntries: friendsRouteEntries,
            groupRouteEntries: groupRouteEntries,
            publicRoutes: publicRoutes,
            publicRouteEntries: publicRouteEntries
        }
    };
}

export const actions = {
    default: async ({ request }) => {
        //console.log("request recieved");
        const data = await request.formData();
        const type = data.get("type");
        const userID = data.get("userID");
        const group_name = data.get("groupName");
        const groupID = Array.from(groupnameDict.entries()).find(([key, value]) => value === group_name)?.[0];
        const routeName = data.get("routeName")?.toString();
        const routeID = data.get("routeID");
        //Data and type validation
        if (type == null) return { status: 400, body: { error: "No type specified" } };
        if (userID == null) return { status: 400, body: { error: "No user specified" } };

        if (type == "addRouteToGroup") {
            if (routeID == null) return { status: 400, body: { error: "No route specified" } };
            if (group_name == null) return { status: 400, body: { error: "No group specified" } };
            if (groupID == undefined) return { status: 400, body: { error: "Invalid group name" } };
            if (routeName == null) return { status: 400, body: { error: "No route name specified" } };

            //convert routeID to number
            const routeIDNum = Number(routeID);
            let routeToAdd = await prisma.routes.findUnique({
                where: {
                    id: Number(routeIDNum)
                }
            });
            if (routeToAdd != undefined && routeToAdd != null) {
                const routeCheck = await prisma.group_routes.findFirst({
                    where: {
                        route_id: Number(routeIDNum),
                        group_id: Number(groupID)
                    }
                });
                if (routeCheck != null  && routeCheck != undefined) {
                    return { status: 400, body: { error: "Route already exists in group" } };
                } else {
                    await prisma.group_routes.create({
                        data: {
                            group_id: groupID,
                            route_id: routeIDNum,
                            priority: 0
                        }
                    });
                    //console.log("Added route to group");
                }
            }
            return { status: 200, body:  "Successfully added route"  };
        }
        if (type == "toggleShowRouteOnMap") {
            if (routeID == null) return { status: 400, body: { error: "No route specified" } };
            let show_value = data.get("showOnMap");
            if (show_value == null) return { status: 400, body: { error: "No show value specified" } };
            let showOnMap: boolean = false;
            if (show_value == "1") showOnMap = true;
            if (show_value == "0") showOnMap = false;
            let check_if_exists = await prisma.routes_to_show.findMany({
                where: {
                    user_id: Number(userID),
                    route_id: Number(routeID)
                }
            });
            if (check_if_exists.length == 0) {
                await prisma.routes_to_show.create({
                    data: {
                        user_id: Number(userID),
                        route_id: Number(routeID),
                    }
                });
                //console.log("Added route to show list");
            }
            if (check_if_exists.length > 0) {
                await prisma.routes_to_show.deleteMany({
                    where: {
                        user_id: Number(userID),
                        route_id: Number(routeID)
                    }
                });
                //console.log("Deleted route from show list");
            }
            return { status: 200, body: "Successfully toggled show on map" };

        }
        if (type == "hideAllRoutes") {
            let check_if_exists = await prisma.routes_to_show.findMany({
                where: {
                    user_id: Number(userID)
                }
            });
            if (check_if_exists.length > 0) {
                await prisma.routes_to_show.deleteMany({
                    where: {
                        user_id: Number(userID)
                    }
                });
                //console.log("Deleted all routes from show list");
            }
            let check_if_exists2 = await prisma.groups_to_show.findMany({
                where: {
                    user_id: Number(userID)
                }
            });
            if (check_if_exists2.length > 0) {
                await prisma.groups_to_show.deleteMany({
                    where: {
                        user_id: Number(userID)
                    }
                });
                //console.log("Deleted all groups from show list");
            }
            return { status: 200, body: "Successfully hid all routes" };
        }

        if (type=="toggleShowGroupOnMap") {
            let show_value = data.get("showOnMap");
            if (show_value == null) return { status: 400, body: { error: "No show value specified" } };
            let showOnMap: boolean = false;
            if (show_value == "1") showOnMap = true;
            if (show_value == "0") showOnMap = false;
            //lookup group id from name
            if (group_name == null) return { status: 400, body: { error: "No group name specified" } };
            if (groupID == undefined) return { status: 400, body: { error: "Invalid group name" } };

            let check_if_exists = await prisma.groups_to_show.findMany({
                where: {
                    user_id: Number(userID),
                    group_id: Number(groupID)
                }
            });
            if (check_if_exists.length == 0) {
                await prisma.groups_to_show.create({
                    data: {
                        user_id: Number(userID),
                        group_id: Number(groupID),
                    }
                });
                //console.log("Added group to show list");
            }
            if (check_if_exists.length > 0) {
                await prisma.groups_to_show.deleteMany({
                    where: {
                        user_id: Number(userID),
                        group_id: Number(groupID)
                    }
                });
                //console.log("Deleted group from show list");
            }
            return { status: 200, body: "Successfully toggled show on map" };
        }

    return { status: 400, body: { error: "Invalid type" } };
}};
