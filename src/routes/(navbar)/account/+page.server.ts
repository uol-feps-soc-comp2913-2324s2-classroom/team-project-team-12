import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { user } from '$lib/interfaces';
import { stripe } from '$lib/stripe';

let curUser: user;
let invalid = true;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    if (!username) {
        invalid = true;
        return { invalid };
    }

    invalid = false;

    curUser = (await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    })) as user;

    return { curUser };
};

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const type = data.get('type');

        if (type === 'editusername') {
            const name = data.get('username');

            // check new username is unique
            let users;

            try {
                users = await prisma.user.findMany();
            } catch (error) {
                return new Response(JSON.stringify(error), { status: 500 });
            }

            for (let i = 0; i < users.length; i++) {
                // check if username already exists
                if (users[i].username == name) {
                    return fail(401, { message: 'Username already exists.' });
                }
            }

            try {
                if (curUser) {
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
                    maxAge: 60 * 60 * 24 * 7,
                });

                return {
                    status: 200,
                    body: { message: 'Username succesfully changed.' },
                };
            } catch (error) {
                console.error('Error editing username.');
            }
        } else if (type === 'editpass') {
            const newPass = data.get('newpass');
            try {
                // hash password
                const newHashed = await bcrypt.hash(newPass as string, 10);

                if (curUser) {
                    await prisma.user.update({
                        where: {
                            username: curUser.username,
                        },
                        data: {
                            password: newHashed,
                        },
                    });

                    cookies.set('sessionPass', newHashed, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: false,
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                    });
                }
            } catch (error) {
                return {
                    status: 500,
                    body: { message: 'Internal Server Error.' },
                };
            }
            return {
                status: 200,
                body: { message: 'Password Changed.' },
            };
        } else if (type === 'checkpass') {
            try {
                // check that the old password is correct before setting a new one
                const oldPass = data.get('oldpass') as string;

                let userPassword;
                if (curUser) {
                    userPassword = await bcrypt.compare(oldPass as string, curUser.password);
                }

                if (userPassword) {
                    return {
                        status: 200,
                        body: { message: 'Password match!' },
                    };
                } else {
                    return fail(401);
                }
            } catch (error) {
                console.error(error);
                return {
                    status: 500,
                    body: { message: 'Internal server error.' },
                };
            }
        } else if (type === 'privacy') {
            try {
                // change user privacy
                const selectedPriv = data.get('selected');
                if (curUser) {
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
                    status: 200,
                };
            } catch (error) {
                return fail(500);
            }
        } else if (type === 'delete') {
            try {
                let deleted;

                if (curUser) {
                    deleted = await prisma.user.delete({
                        where: {
                            username: curUser.username as string,
                        },
                    });
                }

                // cancel the stripe subscription so it doesnt continue charging
                const customerId = curUser?.stripe_token;
                if (!customerId) {
                    return {
                        status: 404,
                        body: { message: 'Customer not found.' },
                    };
                }
                const subscriptions = await stripe.subscriptions.list({
                    limit: 3,
                    customer: customerId,
                });
                const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
                    cancel_at_period_end: true,
                });

                cookies.delete('sessionId', {
                    path: '/',
                });

                cookies.delete('sessionPass', {
                    path: '/',
                });

                return {
                    status: 200,
                    body: deleted,
                    subscription,
                };
            } catch (error) {
                return fail(500);
            }
        }
    },
};
