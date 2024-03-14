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



    const currentUserFriends = await prisma.user.findMany({
        where: {
          OR: [
            {
              id: {
                in: [
                  // Subquery to find IDs of users who are friends with the current user
                  ...(await prisma.relationship.findMany({
                    where: {
                      user_id2: user?.id,
                      is_friend: 1
                    },
                    select: { user_id1: true }
                  })).map(rel => rel.user_id1)
                ]
              }
            },
            {
              id: {
                in: [
                  // Subquery to find IDs of users who are friends with the current user
                  ...(await prisma.relationship.findMany({
                    where: {
                      user_id1: user?.id,
                      is_friend: 1
                    },
                    select: { user_id2: true }
                  })).map(rel => rel.user_id2)
                ]
              }
            }
          ]
        }
      });
      
      
      console.log(currentUserFriends)


    const friendRequests = await prisma.relationship.findMany({
        where: {
             user_id2: user?.id, friend_request: 1, is_friend: 0
        },
    });

    // Load unadded people who are not blocked based on relationships
    const unaddedPeople = await prisma.user.findMany({
        where: {
            NOT: {
                OR: [
                    { id: { in: currentUserFriends.map(friend => friend.id) } },
                    {id: { in: friendRequests.map(request => request.user_id1) } },
                    { id: user?.id }
                ]
            }
        }
    });
    

    // Extract unique user IDs from both sets of relationships
    const userIds = [
        ...new Set([
            ...currentUserFriends.map(person => person.id),
            ...currentUserFriends.map(person => person.id),
            ...friendRequests.map(rel => rel.user_id1),
            ...unaddedPeople.map(person => person.id),
            ...unaddedPeople.map(person => person.id)
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
    const transformedCurrentUserFriends = currentUserFriends.map(person => ({
        id: person.id,
        name: person.username
    }));

    const transformedFriendRequests = friendRequests.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user?.id ? rel.user_id2 : rel.user_id1))?.username || ''
    }));

    const transformedUnaddedPeople = unaddedPeople.map(person => ({
        id: person.id,
        name: person.username
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
                const relationship = await prisma.relationship.findFirst({
                    where: {
                        OR: [
                            { user_id1: user?.id, user_id2: id },
                            { user_id1: id, user_id2: user?.id },
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
            }
            

            if (type === "addFriend" && user?.id !== undefined) {
                try {
                    // Check if the relationship already exists
                    const existingRelationship = await prisma.relationship.findFirst({
                        where: {
                            OR: [
                                { user_id1: user?.id, user_id2: id },
                            ]
                        }
                    });
            
                    if (existingRelationship) {
                        return {
                            status: 400,
                            body: { error: "You have already added this" },
                    
                        };
                    } else {
                        // If the relationship doesn't exist, create a new one
                        await prisma.relationship.create({
                            data: {
                                user_id1: user?.id,
                                user_id2: id,
                                friend_request: 1,
                                is_friend: 0,
                                is_blocked: 0
                            },
                        });
                        console.log('Friend added:');
                    }
                } catch (error) {
                    console.error('Error adding friend:', error);
                } finally {
                    await prisma.$disconnect();
                }
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
