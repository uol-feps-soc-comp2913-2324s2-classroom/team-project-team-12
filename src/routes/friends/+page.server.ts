//Friend Page Server-Side Code
import prisma from '$lib/prisma';

export async function load() {
    // Load current user's friends based on relationships where is_friend = 1
    const currentUserFriends = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: 1, is_friend: 1 },
                { user_id2: 1, is_friend: 1 }
            ]
        }
    });

    // Load unadded people who are not blocked based on relationships
    const unaddedPeople = await prisma.relationship.findMany({
        where: {
            NOT: {
                OR: [
                    { user_id1: 1,},
                    { user_id2: 1,}
                ]
            },
            is_blocked: 0
        }
    });

    // Extract unique user IDs from both sets of relationships
    const userIds = [
        ...new Set([
            ...currentUserFriends.map(rel => rel.user_id1),
            ...currentUserFriends.map(rel => rel.user_id2),
            ...unaddedPeople.map(rel => rel.user_id1),
            ...unaddedPeople.map(rel => rel.user_id2)
        ])
    ];

    // Load users corresponding to the extracted IDs
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }
    });

    // Transform currentUserFriends and unaddedPeople to the required structure
    const transformedCurrentUserFriends = currentUserFriends.map(rel => ({
        id: rel.id,
        name: users.find(user => user.id === rel.user_id1 || user.id === rel.user_id2)?.username || ''
    }));

    const transformedUnaddedPeople = unaddedPeople.map(rel => ({
        id: rel.id,
        name: users.find(user => user.id === rel.user_id1 || user.id === rel.user_id2)?.username || ''
    }));

    return {
        users,
        currentUserFriends: transformedCurrentUserFriends,
        unaddedPeople: transformedUnaddedPeople
    };
}



export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get("type");
        const id = Number(data.get("id"));

        try {
            if (type === "deleteFriend") {
                const relationshipId = Number(data.get("relationshipId"));
                if (!relationshipId) {
                    throw new Error("Relationship ID is missing.");
                }

                // Delete the relationship
                await prisma.relationship.delete({
                    where: {
                        id: relationshipId,
                    },
                });

                return {
                    status: 200,
                    body: { message: "Friend deleted successfully." },
                };
            } else if (type === "addFriend") {
                const userId1 = Number(data.get("userId1"));
                const userId2 = Number(data.get("userId2"));

                if (!userId1 || !userId2) {
                    throw new Error("User IDs are missing.");
                }

                // Create a new relationship
                const newRelationship = await prisma.relationship.create({
                    data: {
                        user_id1: userId1,
                        user_id2: userId2,
                        is_friend: 1, // Assuming a default value for being friends
                    },
                });

                return {
                    status: 200,
                    body: { message: "Friend added successfully.", newRelationship },
                };
            } else {
                throw new Error("Invalid action type.");
            }
        } catch (error) {
            return {
                status: 400,
                body: { error: error.message },
            };
        }
    }
};
