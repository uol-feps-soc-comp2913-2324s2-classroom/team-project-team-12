import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { user } from '$lib/interfaces';

let invalid = true;
let curUser: user;

export const load = (async ({ params: { name }, cookies }) => {
    const username = cookies.get('sessionId');

    if(!username){
        invalid = true;
        return {invalid};
    }

    invalid = false;

    curUser = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    }) as user;
    
    // Decode the encoded group name
    const decodedName = decodeURIComponent(name);
    
    // Find the group
    const group = await prisma.groups.findUnique({
        where: { name: decodedName },
        include: {
            group_routes: true, // Include group routes information
            group_membership: true // Include group membership details
        }
    });

    if (!group) {
        error(404, {
            message: 'Group not found'
        });
    }

    // Extract user IDs from group membership
    const groupMembersId = group.group_membership.map(member => member.user_id);
    
    // Fetch user objects for each user ID
    const members = await prisma.user.findMany({
        where: {
            id: {
                in: groupMembersId
            }
        }
    });

    const memberCount = members.length;

    const creator = await prisma.user.findFirst({
        where: {
            id: group.creator
        }
    })
    

    return { group, members, creator, memberCount, curUser };
});