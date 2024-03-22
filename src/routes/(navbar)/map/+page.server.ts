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

    // Get each route for the user
    let routes = await prisma.routes.findMany({ where: { creator: userId } });

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

    // Parse the route data as an array of `RouteEntry` objects
    let routesData = routes.map(
        async (r): Promise<RouteEntry> => ({
            name: r.route_name,
            createdOn: r.created_on,
            completionTime: r.approximate_completion_time,
            path: await getRoutePath(r.id),
        }),
    );

    return {
        userRoutes: await Promise.all(routesData),
        groupRoutes: [],
    };
};
