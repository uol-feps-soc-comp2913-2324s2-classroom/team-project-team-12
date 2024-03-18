import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import type { user } from '$lib/interfaces'

let curUser: user;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    curUser = await prisma.user.findUnique({
        where: {
            username: username
        },
    }) as user;

    return {curUser};
};

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const type = data.get('type');

        if(type==="editusername"){
            const name = data.get('username');
        
            try {
                if(curUser){
                    await prisma.user.update({
                        where: {
                            username: curUser.username as string,
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
                console.error("Error editing username.");
            }
        }else if(type==="editpass"){
            const newPass = data.get('newpass');
            console.log('attempting to edit password');
            try{
                if(curUser){
                    await prisma.user.update({
                        where: {
                            username: curUser.username as string,
                        },
                        data: {
                            password: newPass as string,
                        },
                    });
                }
            }catch (error){
                return {
                    status: 500,
                    body: { message: 'Internal Server Error.' },
                };
            }
            return {
                status: 200,
                body: { message: 'Password Changed.' },
            };
        }else if(type==="checkpass"){
            try {
                // check that the old password is correct before setting a new one
                const oldPass = data.get('oldpass') as string;
        
                console.log('User password:', curUser?.password);
                console.log('Entered password:', oldPass);
        
                if (curUser?.password === oldPass) {
                    console.log('match');
                    return {
                        status: 200,
                        body: { message: 'Password match!' },
                    };
                } else {
                    console.log('incorrect');
                    return fail(401);
                }
            } catch (error) {
                console.error(error);
                return {
                    status: 500,
                    body: { message: 'Internal server error.' },
                };
            }
        }else if(type === "privacy"){
            try {
                const selectedPriv = data.get('selected');
                if(curUser){
                    await prisma.user.update({
                        where: {
                            username: curUser.username as string,
                        },
                        data: {
                            default_publicity: Number(selectedPriv),
                        },
                    });
                }
                return {
                    status: 200
                }
            }catch (error){
                return fail(500);
            }
        }
    }
}