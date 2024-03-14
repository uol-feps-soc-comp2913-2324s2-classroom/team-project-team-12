//Friend Page Server-Side Code
import prisma from '$lib/prisma';
import type { user } from '$lib/interfaces'

let user: { id: number; username: string; first_name: string | null; last_name: string | null; email: string; password: string; membership_type: number | null; next_payment: Date | null; default_publicity: number | null; admin_status: number | null; stripe_token: string | null; } | null;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });



    const currentUserFriends = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user?.id, is_friend: 1 },
                { user_id2: user?.id, is_friend: 1 }
            ]
        }
    });


    const friendRequests = await prisma.relationship.findMany({
        where: {
             user_id1: user?.id, friend_request: 1, is_friend: 0
        },
    });

    // Load unadded people who are not blocked based on relationships
    const unaddedPeople = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user?.id, is_friend: 0 },
                { user_id2: user?.id, is_friend: 0 }
            ],
            is_blocked: 0
        }
    });
    

    // Extract unique user IDs from both sets of relationships
    const userIds = [
        ...new Set([
            ...currentUserFriends.map(rel => rel.user_id1),
            ...currentUserFriends.map(rel => rel.user_id2),
            ...friendRequests.map(rel => rel.user_id1),
            ...unaddedPeople.map(rel => rel.user_id1),
            ...unaddedPeople.map(rel => rel.user_id2)
        ])
    ];

    
    // Load users corresponding to the extracted IDs
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds // Convert set to array
            }
        }
    });

    // Transform currentUserFriends and unaddedPeople to the required structure
    const transformedCurrentUserFriends = currentUserFriends.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user?.id ? rel.user_id2 : rel.user_id1))?.username || ''
    }));

    const transformedFriendRequests = friendRequests.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user?.id ? rel.user_id2 : rel.user_id1))?.username || ''
    }));

    const transformedUnaddedPeople = unaddedPeople.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user?.id ? rel.user_id2 : rel.user_id1))?.username || ''
    }));


    
    const relationships = [];
    const relationshipList = await prisma.relationship.findMany();
    for (var i = 0; i < relationshipList.length; i++) {
        relationships.push({
            id: relationshipList[i].id,
            user_id1: relationshipList[i].user_id1,
            user_id2: relationshipList[i].user_id2,
            friend_request: relationshipList[i].friend_request,
            is_friend: relationshipList[i].is_friend,
            is_blocked: relationshipList[i].is_blocked
        });
    }

    console.log(transformedFriendRequests)
    return {
        user,
        users,
        relationships,
        currentUserFriends: transformedCurrentUserFriends,
        friendRequests: transformedFriendRequests,
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
                
                //lookup relationship by id
                const relationship = await prisma.relationship.findUnique({
                    where: {
                        id: id
                      },
                });


                //create copy of relationship
                const updatedRelationship = Object.assign({}, relationship);
                //updates relationship with new values
                updatedRelationship.is_friend = 0;
                updatedRelationship.friend_request = 0;
                //update relationship in database
                const updated = await prisma.relationship.update({
                    where: {
                        id: id,
                    },
                    data: updatedRelationship,
                });
                return {
                status: 200,
                body: relationship
                };
            }
            

            if (type === "addFriend") {
                
                //lookup relationship by id
                const relationship = await prisma.relationship.findUnique({
                    where: {
                        id: id
                      },
                });


                //create copy of relationship
                const updatedRelationship = Object.assign({}, relationship);
                //updates relationship with new values
                updatedRelationship.friend_request = 1;
                //update relationship in database
                const updated = await prisma.relationship.update({
                    where: {
                        id: id,
                    },
                    data: updatedRelationship,
                });
                return {
                status: 200,
                body: relationship
                };
            }

            if (type === "acceptFriend") {
                
                //lookup relationship by id
                const relationship = await prisma.relationship.findUnique({
                    where: {
                        id: id
                      },
                });


                //create copy of relationship
                const updatedRelationship = Object.assign({}, relationship);
                //updates relationship with new values
                updatedRelationship.is_friend = 1;
                //update relationship in database
                const updated = await prisma.relationship.update({
                    where: {
                        id: id,
                    },
                    data: updatedRelationship,
                });
                return {
                status: 200,
                body: relationship
                };
            }

            else {
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
