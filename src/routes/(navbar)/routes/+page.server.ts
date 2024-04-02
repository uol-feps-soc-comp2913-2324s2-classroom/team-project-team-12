import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';
import type { route, user, group, group_membership, group_route, Path, RouteEntry }  from '$lib/interfaces';

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
let groupRouteEntries: RouteEntry[] = [];


let publicRoutes: route[] = [];
let publicRouteEntries: RouteEntry[] = [];

export const load = async ({ cookies }) => {
    usernameDict.clear();
    userGroups = [];
    adminGroups = [];
    userRoutes = [];
    groupRoutes = [];
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
            name: route.route_name?.toString(),
            creator: user.username,
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath
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

    userFriendRelations.forEach((relation) => {
        if (relation.user_id1 == user.id) userFriendIDs.push(relation.user_id2);
        else userFriendIDs.push(relation.user_id1);
    });

    //console.log(userFriendIDs);
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
            name: route.route_name?.toString(),
            creator: usernameDict.get(route.creator as number) || "Unknown",
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath
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
    //get group routes
    for (const group of userGroups) {
        const groupRoutesRelations = await prisma.group_routes.findMany({
            where: {
                group_id: group.id
            }
        });
        for (const relation of groupRoutesRelations) {
            const route = await prisma.routes.findUnique({
                where: {
                    id: relation.route_id
                }
            });
            if (route != null) groupRoutes.push(route);
        }
    }
    //Create group route entries
    for (const route of groupRoutes) {
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
            name: route.route_name?.toString(),
            creator: usernameDict.get(route.creator as number) || "Unknown",
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath
        };
        groupRouteEntries.push(RouteEntryObj);
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
            name: route.route_name?.toString(),
            creator: usernameDict.get(route.creator as number) || "Unknown",
            createdOn: route.created_on,
            completionTime: route.approximate_completion_time,
            path: routePath
        };
        publicRouteEntries.push(RouteEntryObj);
    }
    //console.log(publicRoutes);
    //console.log(groupnameDict);
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
            groupRoutes: groupRoutes,
            groupRouteEntries: groupRouteEntries,
            publicRoutes: publicRoutes,
            publicRouteEntries: publicRouteEntries
        }
    };
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get("type");
        const userID = data.get("userID");
        if (data.get("group") == null) return { status: 400, body: { error: "No group specified" } };
        const group_name = data.get("group");
        const groupID = Array.from(groupnameDict.entries()).find(([key, value]) => value === group_name)?.[0];
        console.log(groupID);
        if (groupID == undefined) return { status: 400, body: { error: "Invalid group name" } };
        return { status: 200, body: { type: type, userID: userID, groupID: groupID } };
    }
}
