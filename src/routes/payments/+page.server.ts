import prisma  from '$lib/prisma';

export const load = (async ({ cookies }) => {
    const username = cookies.get('sessionId');

    const user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });

    if(user){
        console.log(user.username);
    }

    return user;
});

export const actions = {
    update: async ({ cookies, request }) => {
        const username = cookies.get('sessionId');
        const type = await request.json();

        try {
            await prisma.user.update({
                where: {
                  username: username as string,
                },
                data: {
                  membership_type: Number(type),
                },
              })
        }
        catch (error) {
            console.error('Error during membership type update:', error);
            return {
                status: 500,
                body: { message: 'Internal Server Error.' },
            };
        }
        
    }

}