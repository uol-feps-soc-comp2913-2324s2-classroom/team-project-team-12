import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies }) => {
    // Get the user's login session
    const username = cookies.get('sessionId');

    // Make the user log in before showing routes
    if (username == undefined) throw redirect(302, '/login');

    return { username };
};

export const actions = {
    default: async ({ request }) => {
        const route = await request.json();

        // Retrieve user information
        let user = await prisma.user.findUnique({ where: { username: route.creator } });
        let userId = user?.id;

        // Append route to user's profile
        let newRoute = await prisma.routes.create({
            data: {
                route_name: route.name,
                created_on: new Date(),
                approximate_completion_time: route.completionTime,
                creator: userId,
                publicity: 1,
                length: 0,
            },
        });

        // Append path to new route
        await route.path.forEach(async (coord, i) => {
            await prisma.route_coordinates.create({
                data: {
                    route_id: newRoute.id,
                    latitude: coord[0],
                    longitude: coord[1],
                    order_position: i,
                },
            });
        });
    },
};
