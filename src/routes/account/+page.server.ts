import prisma from '$lib/prisma';

let user: { id: number; username: string; first_name: string | null; last_name: string | null; email: string; password: string; membership_type: number | null; next_payment: Date | null; default_publicity: number | null; admin_status: number | null; stripe_token: string | null; } | null;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });

    return user;
};

export const actions = {
    editusername: async ({ request, cookies }) =>{
        const data = await request.formData();
        const name = data.get('username');
        
        try {
            if(user){
                await prisma.user.update({
                    where: {
                        username: user.username as string,
                    },
                    data: {
                        username: name as string,
                    },
                });
            }
            
            cookies.set('sessionId', name as string, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            });
            
            return {
                status: 200,
                body: { message: 'Username succesfully changed.' },
            };
    
        }
        catch (error) {
            console.error("Error during editing username.");
        }
    }
}