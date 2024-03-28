import type { user } from '$lib/interfaces.ts';
import prisma from '$lib/prisma';

let invalid = true;
let curUser: user;

export const load = async ({ cookies }) => {
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

    return {curUser};
};