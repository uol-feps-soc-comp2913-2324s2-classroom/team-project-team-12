import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { username } }) => {

    // Find the user
    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) {
        error(404, {
            message: 'User not found'
        });
    }

    // Find the user's friends
    const relationships = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user.id, is_friend: 1 },
                { user_id2: user.id, is_friend: 1 }
            ]
        }
    });

    // Extract all user IDs from the friends array
    const friendIds = relationships.flatMap(friendship => [friendship.user_id1, friendship.user_id2])
                         .filter(id => id !== user.id);

    const friends = await prisma.user.findMany({
        where: {
            id: {
                in: friendIds.filter(id => id !== null) as number[]
            }
        }
    });

    // Find the user's friends
    const userGroups = await prisma.group_membership.findMany({
        where: {
            user_id: user.id
        },
        include: {
            groups: true
        }
    });

    // Extract names of groups associated with the original user
    const groupNames = userGroups.map(groupMembership => groupMembership.groups.name);

    // Fetch the group objects from the database using the group names
    const groups = await prisma.groups.findMany({
        where: {
            name: {
                in: groupNames
            }
        }
    });

    // Extract creator IDs from the fetched group objects
    const creatorIds = groups.map(group => group.creator);

    // Fetch the users associated with the creator IDs
    const creators = await prisma.user.findMany({
        where: {
            id: {
                in: creatorIds
            }
        }
    });
    
    return { user, friends, groups, creators };

}) satisfies PageServerLoad;