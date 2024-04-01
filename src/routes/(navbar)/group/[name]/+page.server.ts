import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Path, RouteEntry } from '$lib/interfaces';

export const load = (async ({ params: { name } }) => {
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

    console.log(group.group_routes)
    
    return { group, members, creator, memberCount };
}) as PageServerLoad;