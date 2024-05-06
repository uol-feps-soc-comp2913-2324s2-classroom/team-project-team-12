import prisma from '$lib/prisma.js';

export const load = async ({ cookies }) => {
    let username = cookies.get('sessionId');
    if (username === undefined) {
        return {user: null};
    }

    let user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    return {user};
};
