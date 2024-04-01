//Admin Page Server-Side Code
//---------------------------------------------------------------Imports--------------------------------------------
import prisma from '$lib/prisma';
import { Decimal } from 'decimal.js';
import bcrypt from 'bcrypt';
//---------------------------------------------------------------Loads Data From Database--------------------------------------------
export async function load() {
    const users = [];
    const userList = await prisma.user.findMany();
    for (let i = 0; i < userList.length; i++) {
        users.push({
            id: userList[i].id,
            username: userList[i].username,
            first_name: userList[i].first_name,
            last_name: userList[i].last_name,
            email: userList[i].email,
            password: userList[i].password,
            membership_type: userList[i].membership_type,
            subscription_start_date: userList[i].subscription_start_date,
            paid: userList[i].paid,
            default_publicity: userList[i].default_publicity,
            admin_status: userList[i].admin_status,
            stripe_token: userList[i].stripe_token,
            owner: userList[i].owner
        });
    }
    //console.log(users);

    const relationships = [];
    const relationshipList = await prisma.relationship.findMany();
    for (let i = 0; i < relationshipList.length; i++) {
        relationships.push({
            id: relationshipList[i].id,
            user_id1: relationshipList[i].user_id1,
            user_id2: relationshipList[i].user_id2,
            friend_request: relationshipList[i].friend_request,
            is_friend: relationshipList[i].is_friend,
            is_blocked: relationshipList[i].is_blocked
        });
    }
    //console.log(relationshipList);

    const routes = [];
    const routeList = await prisma.routes.findMany();
    for (let i = 0; i < routeList.length; i++) {
        routes.push({
            id: routeList[i].id,
            route_name: routeList[i].route_name,
            created_on: routeList[i].created_on,
            length: routeList[i].length,
            approximate_completion_time: routeList[i].approximate_completion_time,
            creator: routeList[i].creator,
            publicity: routeList[i].publicity
        });
    }
    

    const groups = [];
    const groupList = await prisma.groups.findMany();
    for (let i = 0; i < groupList.length; i++) {
        groups.push({
            id: groupList[i].id,
            group_name: groupList[i].name,
            creator: groupList[i].creator,
            publicity: groupList[i].publicity,
            users: []
        });

    }
    const group_memberships = [];
    const groupMembershipList = await prisma.group_membership.findMany();
    for (let i = 0; i < groupMembershipList.length; i++) {
        group_memberships.push({
            id: groupMembershipList[i].id,
            group_id: groupMembershipList[i].group_id,
            user_id: groupMembershipList[i].user_id,
            request: groupMembershipList[i].request,
            member: groupMembershipList[i].member,
            admin: groupMembershipList[i].admin
        });
    }
    //console.log(group_memberships);

    const group_routes = [];
    const groupRouteList = await prisma.group_routes.findMany();
    for (let i = 0; i < groupRouteList.length; i++) {
        group_routes.push({
            id: groupRouteList[i].id,
            group_id: groupRouteList[i].group_id,
            route_id: groupRouteList[i].route_id,
            priority: groupRouteList[i].priority
        });
    }

    const route_coordinates = [];
    const routeCoordinateList = await prisma.route_coordinates.findMany();
    for (let i = 0; i < routeCoordinateList.length; i++) {
        route_coordinates.push({
            id: routeCoordinateList[i].id,
            route_id: routeCoordinateList[i].route_id,
            latitude: routeCoordinateList[i].latitude.toString(),
            longitude: routeCoordinateList[i].longitude.toString(),
            order_position: routeCoordinateList[i].order_position
        });
    }
    
    return {
        users,
        relationships,
        routes,
        route_coordinates,
        groups,
        group_memberships,
        group_routes
    };
}

//---------------------------------------------------------------Handles Form Data--------------------------------------------
export const actions = {
    default: async ({ request }) => {
      const data = await request.formData();
      const type = data.get("type");
      const id = Number(data.get("id"));

        if (type === "deleteUser") {
            //delete user by id
            const deleted = await prisma.user.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }

        if (type === "login") {
            const username = data.get("username")?.toString();
            const password = data.get("password")?.toString();
            console.log(username + " " + password);
            if (username != null && password != null) {
                const user = await prisma.user.findUnique({
                    where: {
                        username: username,
                    },
                });
                console.log(user);
                if (user != null) {
                    const match = await bcrypt.compare(password, user.password);
                    console.log(match);
                    if (match) {
                        if (user.admin_status) {
                            return {
                                status: 200,
                                body: 'Success'
                            };
                        } else {
                            return {
                                status: 404,
                                body: 'Access Denied'
                            };
                        }
                    } else {
                        return {
                            status: 404,
                            body: 'Invalid username or password'
                        };
                }
            }
            return {
                status: 404,
                body: 'Invalid username or password'
            };
        }
    }
                


      if (type === "updateUser" ) {
        //lookup user by id
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        //create copy of user
        const updatedUser = Object.assign({}, user);
        //updates user with new values
        if (data.get("username") != null) {
            const username = data.get("username");
            if (username != null)
            updatedUser.username = username.toString();
        }
        if (data.get("first_name") != null) {
            const firstName = data.get("first_name");
            if (firstName != null)
            updatedUser.first_name = firstName.toString();
        }
        if (data.get("last_name") != null) {
            const lastName = data.get("last_name");
            if (lastName != null)
            updatedUser.last_name = lastName.toString();
        }
        if (data.get("email") != null) {
            const email = data.get("email");
            if (email != null)
            updatedUser.email = email.toString();
        }
        if (data.get("password") != null) {
            const password = data.get("password");
            if (password != null)
            updatedUser.password = password.toString();
        }
        if (data.get("membership_type") != null) {
            const membershipType = Number(data.get("membership_type"));
            if (membershipType != null)
            updatedUser.membership_type = membershipType;
        }
        if (data.get("subscription_start_date") != null) {
            const lastPayment = data.get("subscription_start_date");
            if (lastPayment != null)
            updatedUser.subscription_start_date = new Date(lastPayment.toString());
        }
        if ((data.get("paid") != null)) {
            const paid = (data.get("paid") === "true");
            updatedUser.paid = paid;
        }
        if (data.get("default_publicity") != null) {
            const defaultPublicity = Number(data.get("default_publicity"));
            if (defaultPublicity != null)
            updatedUser.default_publicity = defaultPublicity;
        }
        console.log(data.get("admin_status"));
        if ((data.get("admin_status") != null)) {
            const adminStatus = (data.get("admin_status") === "true");
            updatedUser.admin_status = adminStatus;
        }
        if (data.get("stripe_token") != null) {
            const stripeToken = Number(data.get("stripe_token"));
            if (stripeToken != null)
            updatedUser.stripe_token = stripeToken.toString();
        }
        if (data.get("owner") != null) {
            const owner = (data.get("owner") === "true");
            if (owner != null && owner != undefined)
            updatedUser.owner = owner;
        }
        await prisma.user.update({
            where: {
                id: id,
            },
            data: updatedUser,
        });
        return {
          status: 200,
          body: user
        };
      }
    
        if (type === "deleteRelationship") {
            //delete relationship by id
            const deleted = await prisma.relationship.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }
        
        if (type === "updateRelationship") {
            //lookup relationship by id
            const relationship = await prisma.relationship.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of relationship
            const updatedRelationship = Object.assign({}, relationship);
            //updates relationship with new values
            if (data.get("user_id1") != null) {
                const user_id1 = Number(data.get("user_id1"));
                if (user_id1 != null && user_id1 != undefined)
                updatedRelationship.user_id1 = user_id1;
            }
            if (data.get("user_id2") != null) {
                const user_id2 = Number(data.get("user_id2"));
                console.log("here");
                if (user_id2 != null && user_id2 != undefined)
                updatedRelationship.user_id2 = user_id2;
            }
            if (data.get("friend_request") != null) {
                const friendRequest = (data.get("friend_request") === "true");
                if (friendRequest != null && friendRequest != undefined)
                updatedRelationship.friend_request = friendRequest;
            }
            if (data.get("is_friend") != null) {
                const isFriend = (data.get("is_friend") === "true");
                if (isFriend != null && isFriend != undefined)
                updatedRelationship.is_friend = isFriend;
            }
            if (data.get("is_blocked") != null) {
                const isBlocked = (data.get("is_blocked") === "true");
                if (isBlocked != null && isBlocked != undefined)
                updatedRelationship.is_blocked = isBlocked;
            }
            //update relationship in database
            await prisma.relationship.update({
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

        if (type === "deleteRoute") {
            //delete route by id
            const deleted = await prisma.routes.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }

        if (type === "updateRoute") {
            //lookup route by id
            const route = await prisma.routes.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of route
            const updatedRoute = Object.assign({}, route);
            //updates route with new values
            if (data.get("route_name") != null) {
                const routeName = data.get("route_name");
                if (routeName != null)
                updatedRoute.route_name = routeName.toString();
            }
            if (data.get("created_on") != null) {
                const createdOn = data.get("created_on");
                if (createdOn != null)
                updatedRoute.created_on = new Date(createdOn.toString());
            }
            if (data.get("length") != null) {
                const length = Number(data.get("length"));
                if (length != null)
                updatedRoute.length = length;
            }
            if (data.get("approximate_completion_time") != null) {
                const approximateCompletionTime = Number(data.get("approximate_completion_time"));
                if (approximateCompletionTime != null)
                updatedRoute.approximate_completion_time = approximateCompletionTime;
            }
            if (data.get("creator") != null) {
                const creator = Number(data.get("creator"));
                if (creator != null)
                updatedRoute.creator = creator;
            }
            if (data.get("publicity") != null) {
                const publicity = Number(data.get("publicity"));
                if (publicity != null)
                updatedRoute.publicity = publicity;
            }
            //update route in database
            await prisma.routes.update({
                where: {
                    id: id,
                },
                data: updatedRoute,
            });
            return {
            status: 200,
            body: route
            };
        }

        if (type === "deleteGroup") {
            //delete group by id
            const deleted = await prisma.groups.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }

        if (type === "updateGroup") {
            //lookup group by id
            const group = await prisma.groups.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of group
            const updatedGroup = Object.assign({}, group);
            //updates group with new values
            if (data.get("group_name") != null) {
                const groupName = data.get("group_name");
                if (groupName != null)
                updatedGroup.name = groupName.toString();
            }
            if (data.get("creator") != null) {
                const creator = Number(data.get("creator"));
                if (creator != null)
                updatedGroup.creator = creator;
            }
            if (data.get("publicity") != null) {
                const publicity = Number(data.get("publicity"));
                if (publicity != null)
                updatedGroup.publicity = publicity;
            }
            //update group in database
            await prisma.groups.update({
                where: {
                    id: id,
                },
                data: updatedGroup,
            });
            return {
            status: 200,
            body: group
            };
        }
        
        if (type === "deleteGroupMembership") {
            //delete group membership by id
            const deleted = await prisma.group_membership.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }

        if (type === "updateGroupMembership") {
            //lookup group membership by id
            console.log(data.get("group_id"), data.get("user_id"), data.get("admin"));
            const groupMembership = await prisma.group_membership.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of group membership
            const updatedGroupMembership = Object.assign({}, groupMembership);
            //updates group membership with new values
            if (data.get("group_id") != null) {
                const groupId = Number(data.get("group_id"));
                if (groupId != null)
                updatedGroupMembership.group_id = groupId;
            }
            if (data.get("user_id") != null) {
                const userId = Number(data.get("user_id"));
                if (userId != null)
                updatedGroupMembership.user_id = userId;
            }
            if (data.get("request") != null) {
                const request = (data.get("request") === "true");
                if (request != null && request != undefined)
                updatedGroupMembership.request = request;
            }
            if (data.get("member") != null) {
                const member = (data.get("member") === "true");
                if (member != null && member != undefined)
                updatedGroupMembership.member = member;
            }
            if (data.get("admin") != null) {
                const admin = (data.get("admin") === "true");
                if (admin != null && admin != undefined)
                updatedGroupMembership.admin = admin;
            }
            //update group membership in database
            await prisma.group_membership.update({
                where: {
                    id: id,
                },
                data: updatedGroupMembership,
            });
            return {
            status: 200,
            body: groupMembership
            };
        }

        if (type === "deleteGroupRoute") {
            //delete group route by id
            const deleted = await prisma.group_routes.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }
        
        if (type === "updateGroupRoute") {
            //lookup group route by id
            const groupRoute = await prisma.group_routes.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of group route
            const updatedGroupRoute = Object.assign({}, groupRoute);
            //updates group route with new values
            if (data.get("group_id") != null) {
                const groupId = Number(data.get("group_id"));
                if (groupId != null)
                updatedGroupRoute.group_id = groupId;
            }
            if (data.get("route_id") != null) {
                const routeId = Number(data.get("route_id"));
                if (routeId != null)
                updatedGroupRoute.route_id = routeId;
            }
            if (data.get("priority") != null) {
                const priority = Number(data.get("priority"));
                if (priority != null)
                updatedGroupRoute.priority = priority;
            }
            //update group route in database
            await prisma.group_routes.update({
                where: {
                    id: id,
                },
                data: updatedGroupRoute,
            });
            return {
            status: 200,
            body: groupRoute
            };
        }

        if (type === "deleteRouteCoordinate") {
            //delete route coordinate by id
            const deleted = await prisma.route_coordinates.delete({
                where: {
                    id: id,
                },
            });
            return {
            status: 200,
            body: deleted
            };
        }

        if (type === "updateRouteCoordinate") {
            //lookup route coordinate by id
            const routeCoordinate = await prisma.route_coordinates.findUnique({
                where: {
                    id: id,
                },
            });
            //create copy of route coordinate
            const updatedRouteCoordinate = Object.assign({}, routeCoordinate);
            //updates route coordinate with new values
            if (data.get("route_id") != null) {
                const routeId = Number(data.get("route_id"));
                if (routeId != null)
                updatedRouteCoordinate.route_id = routeId;
            }
            if (data.get("latitude") != null) {
                const latitude = Number(data.get("latitude"));
                if (!isNaN(latitude)) {
                    updatedRouteCoordinate.latitude = new Decimal(latitude);
                } else {
                    console.error('Invalid latitude value');
                }
            }
            if (data.get("longitude") != null) {
                const longitude = Number(data.get("longitude"));
                if (!isNaN(longitude)) {
                    updatedRouteCoordinate.longitude = new Decimal(longitude);
                } else {
                    console.error('Invalid longitude value');
                }
            }
            if (data.get("order_position") != null) {
                const orderPosition = Number(data.get("order_position"));
                if (orderPosition != null)
                updatedRouteCoordinate.order_position = orderPosition;
            }
            //update route coordinate in database
            await prisma.route_coordinates.update({
                where: {
                    id: id,
                },
                data: updatedRouteCoordinate,
            });
            return {
            status: 200
            };
        }
        

    }};