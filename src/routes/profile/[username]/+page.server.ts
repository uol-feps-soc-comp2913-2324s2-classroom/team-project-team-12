import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { user } from '$lib/interfaces'

export const load = (async ({ params: { username }, cookies }) => {
    const profileUser = cookies.get('sessionId');


    const profile = await prisma.user.findUnique({
        where: { username: profileUser },
    });

    // Find the user
    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) {
        error(404, {
            message: 'User not found'
        });
    }

    if (!profile) {
        error(404, {
            message: 'User not found'
        });
    }

    // Check if the logged-in user has requested to follow the user whose profile is being visited
    const friendRequest = await prisma.relationship.findFirst({
        where: {
            user_id1: profile.id,
            user_id2: user.id,
            friend_request: true,
            is_friend: false,
            is_blocked: false
        }
    });

    console.log(friendRequest);


    // Find the user's friends
    const relationships = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user.id, is_friend: true },
                { user_id2: user.id, is_friend: true }
            ]
        }
    });

    const isFriend = relationships.some(relationship => {
        return relationship.user_id1 === profile.id || relationship.user_id2 === profile.id;
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
    
    return { user, friends, groupsWithMembersCount, friendCount, groupCount, isFriend, friendRequest };

}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const type = data.get("type");
        const id = Number(data.get("id"));

        try {
            const profileUser = cookies.get('sessionId');

            if (!profileUser) {
                return {
                    status: 401,
                    body: { error: "Unauthorized" },
                };
            }

            const user = await prisma.user.findUnique({
                where: { username: profileUser },
            });

            if (!user) {
                return {
                    status: 400,
                    body: { error: "User not found" },
                };
            }

            if (type === "addFriend") {
                try {
                    const existingRelationship = await prisma.relationship.findFirst({
                        where: {
                            OR: [
                                { user_id1: user.id, user_id2: id },
                            ]
                        }
                    });
                    
                    if (existingRelationship) {
                        return {
                            status: 400,
                            body: { error: "You have already added this" },
                        };
                    } else {
                        await prisma.relationship.create({
                            data: {
                                user_id1: user.id,
                                user_id2: id,
                                friend_request: true,
                                is_friend: false,
                                is_blocked: false
                            },
                        });
                        console.log('Friend added:');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error adding friend:', error);
                    return {
                        status: 500,
                        body: { error: "Internal server error" },
                    };
                } finally {
                    await prisma.$disconnect();
                }
            } else if (type === "deleteFriend") {
                const relationship = await prisma.relationship.findFirst({
                    where: {
                        OR: [
                            { user_id1: user.id, user_id2: id },
                            { user_id1: id, user_id2: user.id },
                        ]
                    }
                });

                const firstRelationshipId = relationship ? relationship.id : undefined;

                if (firstRelationshipId !== undefined) {
                    await prisma.relationship.delete({
                        where: {
                            id: firstRelationshipId
                        }
                    });
                }
                return {
                    status: 200,
                    body: relationship
                };
            } else {
                return {
                    status: 400,
                    body: { error: "Invalid request type" },
                };
            }
        } catch (error) {
            return {
                status: 400,
                body: { error: "Failed" },
            };
        }
    }
};