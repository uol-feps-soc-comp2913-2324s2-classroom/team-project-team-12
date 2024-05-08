import prisma from '$lib/prisma.js';

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');
    const password = cookies.get('sessionPass');
    if (username === undefined || password === undefined) {
        return { user: null };
    }

    const user = await prisma.user.findUnique({
        where: {
            username: username,
            password: password,
        },
    });
    return { user };
};
