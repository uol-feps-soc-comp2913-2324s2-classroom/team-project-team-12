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
        },
        include: {
            groups: {
                select: {
                    name: true,
                    id: true
                }
            },
        }
    })

    const invited = await prisma.group_membership.findMany({
        where: {
            user_id: user?.id,
            invite: true,
        },
        include: {
            groups: {
                select: {
                    name: true,
                    id: true,
                    creator: true
                }
            },
        }
    });
    const invitedWithCreator = await Promise.all(invited.map(async (invite) => {
        const creatorUser = await prisma.user.findUnique({
            where: {
                id: invite.groups.creator,
            },
        });
        return {
            ...invite,
            groups: {
                ...invite.groups,
                creator: creatorUser?.username,
            },
        };
    }));
    
    

    
    const notMemberOfGroups = await prisma.groups.findMany({
        where: {
            NOT: {
                OR: [
                    {id: { in: currentUserGroups.map(group => group.id) } },
                    {id: { in: requested.map(request => request.group_id) } },
                    {id: { in: invited.map(invite => invite.group_id) } }
                ]
            }
        }
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
                      is_friend: true
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
                      is_friend: true
                    },
                    select: { user_id2: true }
                  })).map(rel => rel.user_id2)
                ]
              }
            }
          ]
        }
      });
    
    return {
        currentUserGroups,
        groupRequests,
        notMemberOfGroups,
        requested,
        currentUserFriends,
        invitedWithCreator
    };
}


export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get("type");
        const id = Number(data.get("id"));
        const groupName = String(data.get("groupName"))
        const idList: number[] = data.getAll("friendIds[]").map((id: string) => Number(id));
    


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
                updatedMembership.request = false;
                updatedMembership.invite = false;
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

            const firstMembershipId = membership ? membership.id : undefined;

              //delete membership in database
              await prisma.group_membership.delete({
                  where: {
                      id: firstMembershipId,
                  },
              });
              return {
              status: 200,
              body: membership
              };
          }

          if (type === "cancelRequest") {
                
            //lookup membership by id
          const membership = await prisma.group_membership.findUnique({
              where: {
                  id: id
                },
          });

          const firstMembershipId = membership ? membership.id : undefined;

            //delete membership in database
            await prisma.group_membership.delete({
                where: {
                    id: firstMembershipId,
                },
            });
            return {
            status: 200,
            body: membership
            };
        }

        if (type === "createGroup" && user?.id !== undefined) {
            try {
                if (groupName.length > 25){
                    return{
                        status: 400,
                        body: {error: "Group name cannot be longer than 25 characters"}

                    }
                }
                else if (groupName.length < 3){
                    return{
                        status: 400,
                        body: {error: "Group name cannot be shorter than 3 characters"}

                    }
                }
            
                
                const existingGroup = await prisma.groups.findFirst({
                    where: {
                        name: groupName,
                    }
                });
                if (existingGroup) {
                    return {
                        status: 400,
                        body: { error: "This group name is already in use" },
                    };
                } else {
                    // If the group doesn't exist, create a new one
                    const createdGroup = await prisma.groups.create({
                        data: {
                            name: groupName,
                            creator: user?.id,
                        },
                    });
        
                    if (!createdGroup) {
                        throw new Error("Failed to create group");
                    }
        
                    const groupID = createdGroup.id;
        
                    await prisma.group_membership.create({
                        data: {
                            group_id: groupID,
                            user_id: user?.id,
                            member: true,
                            admin: true,
                        },
                    });

                    if (idList.length > 0){
                        for (let i = 0; i < idList.length; i++){
                            await prisma.group_membership.create({
                                data: {
                                    group_id: groupID,
                                    user_id: idList[i],
                                    invite: true
                                },
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error creating group:', error);
            } finally {
                await prisma.$disconnect();
            }
        } 
                     


        } catch (error) {
            return {
                status: 400,
                body: { error: "Error completing action" },
        
            };
        }
        return{
            status: 200
        }
        

    }
};