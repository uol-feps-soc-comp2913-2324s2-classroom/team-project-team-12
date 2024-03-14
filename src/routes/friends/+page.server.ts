//Friend Page Server-Side Code
import prisma from '$lib/prisma';
import type { user } from '$lib/interfaces'

let user: user;

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
                { user_id1: user.id, is_friend: 1 },
                { user_id2: user.id, is_friend: 1 }
            ]
        }
    });

    // Load unadded people who are not blocked based on relationships
    const unaddedPeople = await prisma.relationship.findMany({
        where: {
            OR: [
                { user_id1: user.id, is_friend: 0 },
                { user_id2: user.id, is_friend: 0 }
            ],
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
                in: userIds // Convert set to array
            }
        }
    });

    // Transform currentUserFriends and unaddedPeople to the required structure
    const transformedCurrentUserFriends = currentUserFriends.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user.id ? rel.user_id2 : rel.user_id1))?.username || ''
    }));

    const transformedUnaddedPeople = unaddedPeople.map(rel => ({
        id: rel.id,
        name: users.find(u => u.id === (rel.user_id1 === user.id ? rel.user_id2 : rel.user_id1))?.username || ''
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
        unaddedPeople: transformedUnaddedPeople
    };
}





export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get("type");
        const id = Number(data.get("id"));
        const name = (data.get("username"))
        console.log("id",id);
        console.log("name",name);
        //console.log("user",user.id);

        try {

            if (type === "deleteFriend") {
                
                //lookup relationship by id
                const relationship = await prisma.relationship.findUnique({
                    where: {
                        id: id
                      },
                });

                console.log(relationship)

                //create copy of relationship
                const updatedRelationship = Object.assign({}, relationship);
                //updates relationship with new values
                updatedRelationship.is_friend = 0;
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
