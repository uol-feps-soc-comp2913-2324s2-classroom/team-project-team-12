import prisma from '$lib/prisma';
import type { user } from '$lib/interfaces'

let user: user

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    }) as user;

    const currentUserGroups = await prisma.groups.findMany({
        where: {
          OR: [
            {
              id: {
                in: [
                  ...(await prisma.group_membership.findMany({
                    where: {
                      user_id: user?.id, member: true
                    },
                    select: { group_id: true }
                  })).map(mem => mem.group_id)
                ]
              }
            },
          ]
        }
      });
      
      


    const groupRequests = await prisma.group_membership.findMany({
        where: {
            groups: { creator: user?.id },
            request: true,
            member: false  // Requests for groups created by the user
        },
        include: {
            groups: {
                select: {
                    name: true,
                    id: true
                }
            },
            users: {
                select: {
                    username: true
                }
            }
        }
    });
    
    const requested = await prisma.group_membership.findMany({
        where: {
            user_id: user?.id,
            request: true,
            member: false  // Requests for groups created by the user
        },
    })

    const notMemberOfGroups = await prisma.groups.findMany({
        where: {
            NOT: {
                OR: [
                    {id: { in: currentUserGroups.map(group => group.id) } },
                    {id: { in: requested.map(request => request.group_id) } },
                ]
            }
        }
    });
    
    const Groups = await prisma.group_membership.findMany({})

    console.log("Current",currentUserGroups)
    /*console.log("Requests",groupRequests)
    console.log("Not",notMemberOfGroups)*/

    console.log("Current",Groups)

    return {
        currentUserGroups,
        groupRequests,
        notMemberOfGroups,
    };
}


export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get("type");
        const id = Number(data.get("id"));

        try {

            if (type === "leaveGroup") {
                //lookup group by id
                const membership = await prisma.group_membership.findFirst({
                    where: {
                        group_id: id,
                        user_id: user?.id
                    }
                });
            
                const firstMembershipId = membership ? membership.id : undefined;
            
                if (firstMembershipId !== undefined) {
                    await prisma.group_membership.delete({
                        where: {
                            id: firstMembershipId
                        }
                    });
                }

                return {
                status: 200,
                body: membership
                };
            }
            

            if (type === "joinGroup" && user?.id !== undefined) {
                try {
                    // Check if the membership already exists
                    const existingMembership = await prisma.group_membership.findFirst({
                        where: {
                            group_id: id,
                            user_id: user?.id
                        }
                    });
            
                    if (existingMembership) {
                        return {
                            status: 400,
                            body: { error: "You already have a membership" },
                    
                        };
                    } else {
                        // If the membership doesn't exist, create a new one
                        await prisma.group_membership.create({
                            data: {
                                user_id: user?.id,
                                group_id: id,
                                request: true
                            },
                        });
                        console.log('Request sent:');
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                } finally {
                    await prisma.$disconnect();
                }
            }

            if (type === "acceptRequest") {
                
                //lookup membership by id
                const membership = await prisma.group_membership.findUnique({
                    where: {
                        id: id
                      },
                });


                //create copy of membership
                const updatedMembership = Object.assign({}, membership);
                //updates membership with new values
                updatedMembership.member = true;
                //update membership in database
                await prisma.group_membership.update({
                    where: {
                        id: id,
                    },
                    data: updatedMembership,
                });
                return {
                status: 200,
                body: membership
                };
            }

            if (type === "declineRequest") {
                
              //lookup membership by id
              const membership = await prisma.group_membership.findUnique({
                  where: {
                      id: id
                    },
              });


              //create copy of membership
              const updatedMembership = Object.assign({}, membership);
              //updates membership with new values
              updatedMembership.request = false;
              //update membership in database
              await prisma.group_membership.update({
                  where: {
                      id: id,
                  },
                  data: updatedMembership,
              });
              return {
              status: 200,
              body: membership
              };
          }

            else {
                throw new Error("Invalid action type.");
            }



        } catch (error) {
            return {
                status: 400,
                body: { error: "Error completing action" },
        
            };
        }
        

    }
};