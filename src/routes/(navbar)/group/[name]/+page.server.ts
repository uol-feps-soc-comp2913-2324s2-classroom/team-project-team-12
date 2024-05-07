import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Path, RouteEntry, route, groupRouteEntry, user} from '$lib/interfaces';

let user: user;
let groupRoutes: route[] = [];
let groupRouteEntries: groupRouteEntry[] = [];
let usernameDict: Map<number, string> = new Map();


export const load = (async ({ cookies, params: { name } }) => {
    const username = cookies.get('sessionId');
    usernameDict.clear();
    groupRouteEntries = [];
    const allUsersList = await prisma.user.findMany();
    for (const user of allUsersList) {
        usernameDict.set(user.id, user.username);
    }

    user = await prisma.user.findUnique({
        where: {
          username: username as string,
        },
      }) as user;

    // Decode the encoded group name
    const decodedName = decodeURIComponent(name);
    
    // Find the group
    const group = await prisma.groups.findUnique({
        where: { name: decodedName },
        include: {
            group_routes: true, // Include group routes information
            group_membership: true // Include group membership details
        }
    });

    if (!group) {
        error(404, {
            message: 'Group not found'
        });
    }

    // Extract user IDs from group membership
    const groupMembersId = group.group_membership.map(member => member.user_id);
    
    // Fetch user objects for each user ID
    const members = await prisma.user.findMany({
        where: {
            id: {
                in: groupMembersId
            }
        }
    });

    const memberCount = members.length;

    const creator = await prisma.user.findFirst({
        where: {
            id: group.creator
        }
    })

    // Find the user's friends
    const relationships = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user.id, is_friend: true },
                { user_id2: user.id, is_friend: true }
            ]
        }
    });

    const isFriend = creator && relationships.some(relationship => {
        return relationship.user_id1 === creator.id || relationship.user_id2 === creator.id;
    });

    // Retrieve a route's path
    const getRoutePath = async (id: number): Promise<Path> => {
        // Retrieve the path from the database
        let path = await prisma.route_coordinates.findMany({
            where: { route_id: id },
            orderBy: { order_position: 'asc' },
        });

        // Return the route's path as a `Path` object
        return path.map((c) => [Number(c.latitude), Number(c.longitude)]);
    };

    // #########################
    const groupRoutesRelations = await prisma.group_routes.findMany({
        where: {
            group_id: group.id,
        },
    });
    let groupRouteEntriesList: RouteEntry[] = [];
    for (const routeRelation of groupRoutesRelations) {
        const route = await prisma.routes.findUnique({
            where: {
                id: routeRelation.route_id,
            },
        });
        if (route != null) groupRoutes.push(route);
        if (route != null) {
            if (route.route_name == null) route.route_name = 'Unnamed Route';
            if (route.created_on == null) route.created_on = new Date();
            if (route.approximate_completion_time == null) route.approximate_completion_time = 0;
            let routeCoords = await prisma.route_coordinates.findMany({
                where: { route_id: route.id },
                orderBy: { order_position: 'asc' },
            });
            //convert route coordinates to path
            let routePath: Path = [];
            for (const coord of routeCoords) {
                routePath.push([Number(coord.latitude), Number(coord.longitude)]);
            }
            let RouteEntryObj: RouteEntry = {
                id: route.id,
                name: route.route_name?.toString(),
                creator: usernameDict.get(route.creator as number) || 'Unknown',
                createdOn: route.created_on,
                completionTime: route.approximate_completion_time,
                path: routePath,
                group: group.name,
                publicity: route.publicity as number,
                showOnMap: false,
            };
            groupRouteEntriesList.push(RouteEntryObj);
        }
    }
    let groupRouteEntryObj: groupRouteEntry = {
        group_name: group.name,
        routes: groupRouteEntriesList,
        showOnMap: false,
    };
    groupRouteEntries.push(groupRouteEntryObj);
    //#############################

    const isMember = members.some(member => member.id === user.id);

    return { group, members, creator, memberCount, groupRouteEntryObj, user, isFriend, isMember};
    
}) as PageServerLoad;




export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get('type');
        const groupID = data.get('groupID');
        const routeID = data.get('routeID');

        //Data and type validation
        if (type == null) return { status: 400, body: { error: 'No type specified' } };

        if (type == 'deleteRouteFromGroup') {
            if (routeID == null) return { status: 400, body: { error: 'No route specified' } };
            if (groupID == undefined) return { status: 400, body: { error: 'Invalid group name' } };
            const routeIDNum = Number(routeID);
            const groupIDNum = Number(groupID);

            let groupRouteID = await prisma.group_routes.findFirst({
                where: {
                    group_id: groupIDNum,
                    route_id: routeIDNum,
                },
            });
            //Delete route from group
            await prisma.group_routes.delete({
                where: {
                    id: groupRouteID?.id,
                },
            });
                }
        return { status: 400, body: { error: 'Invalid type' } };
    },
};