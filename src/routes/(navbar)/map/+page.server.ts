import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

import type { Path, RouteEntry } from '$lib/interfaces';

export const load = async ({ cookies }) => {
    // Get the user's login session
    const username = cookies.get('sessionId');

    // Make the user log in before showing routes
    if (username == undefined) throw redirect(302, '/login');

    // Get the user's ID
    const user = await prisma.user.findUnique({ where: { username } });
    const userId = user?.id;
    const userGroups = await prisma.groups.findMany({ where: { user } });

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

    // Get each route for the user
    let userRoutes = await prisma.routes.findMany({ where: { creator: userId } });

    // Parse the route data as an array of `RouteEntry` objects
    let userRoutesData = userRoutes.map(
        async (r): Promise<RouteEntry> => ({
            name: r.route_name,
            creator: username,
            createdOn: r.created_on,
            completionTime: r.approximate_completion_time,
            path: await getRoutePath(r.id),
        }),
    );

    const getGroupRoutesData = async () => {
        let groupRoutesData: any = {};

        for (const group of userGroups) {
            const members = await prisma.group_membership.findMany({
                where: {
                    AND: [{ NOT: { user_id: userId } }, { group_id: group.id }],
                },
            });

            let memberData: any = {};

            for (const member of members) {
                let memberRoutes = await prisma.routes.findMany({ where: { creator: member.id } });
                let memberName = await prisma.user.findUnique({ where: { id: member.id } });

                let memberRoutesData = await Promise.all(
                    memberRoutes.map(
                        async (r): Promise<RouteEntry> => ({
                            name: r.route_name,
                            creator: memberName?.username as string,
                            createdOn: r.created_on,
                            completionTime: r.approximate_completion_time,
                            path: await getRoutePath(r.id),
                        }),
                    ),
                );

                memberData[memberName?.username as string] = memberRoutesData;
            }

            groupRoutesData[group.name] = memberData;
        }

        return groupRoutesData;
    };

    return {
        userRoutes: Promise.all(userRoutesData),
        groupRoutes: getGroupRoutesData(),
    };
};
