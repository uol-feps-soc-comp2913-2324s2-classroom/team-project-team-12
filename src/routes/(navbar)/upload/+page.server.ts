import prisma from '$lib/prisma';
import gpxParser from 'gpxparser';
import { redirect } from '@sveltejs/kit';

import type { RouteEntry } from '$lib/interfaces';

// Append a route to the DB
const appendRouteToDB = async (userId: number, route: RouteEntry) => {
    // Append the route metadata to its respective table
    const newRoute = await prisma.routes.create({
        data: {
            route_name: route.name,
            created_on: route.createdOn,
            approximate_completion_time: route.completionTime,
            creator: userId,
            publicity: route.publicity,
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
        const privacy = formData?.get('privacy');

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

            let gpx = new gpxParser();
            gpx.parse(data.replace(/(\r\n|\n|\r)/gm, ''));

            if (gpx.routes.length == 0) return { success: false };

            const routes = gpx.routes.map((r) => ({
                name: r.name,
                creator: username,
                createdOn: new Date(),
                completionTime: (r.points[r.points.length - 1].time.getTime() - r.points[0].time.getTime()) / 1000,
                path: r.points.map((p) => [p.lat, p.lon]),
                publicity: Number(privacy),
            }));

            // Append the route to the DB
            routes.forEach((r) => appendRouteToDB(userId as number, r));

            // Load the map page
            return { success: true };
        } catch {
            // Handle errors
            console.error('Invalid data provided');
            return { success: false };
        }
    },
};
