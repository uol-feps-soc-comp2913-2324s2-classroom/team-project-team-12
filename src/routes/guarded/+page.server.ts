import prisma  from '$lib/prisma';

export const load = (async ({ cookies }) => {
    const username = cookies.get('sessionId');

    console.log(username);

    const user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });

    let name = '';

    if(user){
        console.log(user.username);
    }

    return user;
});