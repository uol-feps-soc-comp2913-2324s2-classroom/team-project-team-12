import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

import type { RouteEntry } from '$lib/interfaces';

export const load = async ({ cookies }) => {
    // Get the user's login session
    const username = cookies.get('sessionId');

    // Make the user log in before showing routes
    if (username == undefined) throw redirect(302, '/login');

    // Get the user's ID
    const user = await prisma.user.findUnique({ where: { username } });
    const userId = user?.id;

    // Enforce the paywall
    if (user?.membership_type == 4 || user.next_payment_date < new Date()) throw redirect(302, '/payments');

    const userRoutesToShow = await prisma.routes_to_show.findMany({ where: { user_id: userId } });

    const userRoutes = userRoutesToShow.map(async (r): Promise<RouteEntry> => {
        const route = await prisma.routes.findUnique({
            where: { id: r.route_id },
            include: { route_coordinates: true },
        });

        return {
            id: route?.id,
            name: route?.route_name,
            creator: (await prisma.user.findUnique({ where: { id: route?.creator } }))?.username,
            createdOn: route?.created_on,
            completionTime: route?.approximate_completion_time,
            path: route?.route_coordinates
                .sort((a, b) => a.order_position - b.order_position)
                .map((c) => [Number(c.latitude), Number(c.longitude)]),
            publicity: route?.publicity,
            group: null,
            showOnMap: true,
        };
    });

    let groupRoutesData = {};
    const groupsToShow = await prisma.groups_to_show.findMany({ where: { user_id: userId } });

    const a = groupsToShow.map(async (g) => {
        const group = await prisma.groups.findUnique({ where: { id: g.group_id } });
        const groupRouteIds = await prisma.group_routes.findMany({ where: { group_id: g.group_id } });

        const groupRoutes = groupRouteIds.map(async (id) => {
            const route = await prisma.routes.findUnique({
                where: { id: id.route_id },
                include: { route_coordinates: true },
            });

            const creator = await prisma.user.findUnique({ where: { id: route.creator } });
            const path = route.route_coordinates
                .sort((a, b) => a.order_position - b.order_position)
                .map((p) => [Number(p.latitude), Number(p.longitude)]);

            return {
                id: route.id,
                name: route?.route_name,
                creator: creator?.username,
                createdOn: route.created_on,
                completionTime: route.approximate_completion_time,
                path,
                publicity: route.publicity,
            };
        });

        groupRoutesData[group?.name] = await Promise.all(groupRoutes);
    });
    await Promise.all(a);

    const userRoutesData = await Promise.all(userRoutes);

    return {
        username,
        userRoutes: Promise.resolve(userRoutesData),
        groupRoutes: Promise.resolve(groupRoutesData),
    };
};
