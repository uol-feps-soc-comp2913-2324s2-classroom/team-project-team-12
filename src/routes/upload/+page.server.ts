import { dev } from '$app/environment';
import prisma from '$lib/prisma';

import type { RouteEntry } from '$lib/interfaces';
import { redirect } from '@sveltejs/kit';

// Append a route to the DB
const appendRouteToDB = async (userId: number, route: RouteEntry) => {
    // Append the route metadata to its respective table
    let newRoute = await prisma.routes.create({
        data: {
            route_name: route.name,
            created_on: route.createdOn,
            approximate_completion_time: route.completionTime,
            creator: userId,
            publicity: 1,
            length: 0,
        },
    });

    // Append the route coordinates to its respective table
    route.path.forEach(async (coord, i) => {
        await prisma.route_coordinates.create({
            data: {
                route_id: newRoute.id,
                latitude: coord[0],
                longitude: coord[1],
                order_position: i,
            },
        });
    });
};

export const actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const file = formData?.get('file') as File;

        // Get the user's login session
        const username = cookies.get('sessionId');

        // Make the user log in before showing routes
        if (username == undefined) throw redirect(302, '/login');

        // Get the user's ID
        const user = await prisma.user.findUnique({ where: { username } });
        const userId = user?.id;

        try {
            // Parse the data
            let data = await file.text();
            let json = JSON.parse(data) as RouteEntry[];

            let routes = json.map((route) => {
                route.createdOn = new Date(route.createdOn);
                route.path = route.path.map((coord) => [Number(coord[0]), Number(coord[1])]);

                return route;
            });

            // Log the new route data (for troubleshooting)
            if (dev) console.log(routes);

            // Append the route to the DB
            routes.forEach((r) => appendRouteToDB(userId, r));
        } catch {
            // Handle errors
            console.error('Invalid data provided');
        }
    },
};
