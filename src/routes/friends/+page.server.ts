//Admin Page Server-Side Code
//---------------------------------------------------------------Imports--------------------------------------------
import prisma from '$lib/prisma';
import { Decimal } from 'decimal.js';

//---------------------------------------------------------------Loads Data From Database--------------------------------------------
export async function load() {
    const users = [];
    const userList = await prisma.user.findMany();
    for (var i = 0; i < userList.length; i++) {
        users.push({
            id: userList[i].id,
            username: userList[i].username,
            first_name: userList[i].first_name,
            last_name: userList[i].last_name,
        });
    }


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
        users,
        relationships
    }

}