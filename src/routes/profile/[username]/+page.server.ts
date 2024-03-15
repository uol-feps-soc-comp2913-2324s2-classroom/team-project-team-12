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

    const friendCount =friendIds.length;

    const friends = await prisma.user.findMany({
        where: {
            id: {
                in: friendIds.filter(id => id !== null) as number[]
            }
        }
    });

    // Find the user's groups
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

    // Fetch all groups
    const groups = await prisma.groups.findMany({
        where: {
            name: {
                in: groupNames
            }
        },
        include: {
            group_membership: true // Include the group membership data
        }
    });

    const groupCount =groups.length;

    // Iterate over each group and calculate the number of members
    const groupsWithMembersCount = groups.map(group => {
        const memberCount = group.group_membership.length; // Calculate the length of group_membership array
        return {
            ...group, // Spread the existing group object
            memberCount // Add a new property to store the member count
        };
    });
    
    return { user, friends, groupsWithMembersCount, friendCount, groupCount };

}) satisfies PageServerLoad;