import prisma  from '$lib/prisma';

export const load = (async ({ cookies }) => {
    const username = cookies.get('sessionId');

    const user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });

    return {user};
});