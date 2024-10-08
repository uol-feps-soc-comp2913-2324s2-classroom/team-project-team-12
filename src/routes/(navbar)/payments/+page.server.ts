import prisma from '$lib/prisma';
import type { user } from '$lib/interfaces';
import { fail } from '@sveltejs/kit';
import { stripe } from '$lib/stripe';

let user: user | null;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    const user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });

    if (user) {
        // console.log(user.username);
    }

    if (user?.stripe_token === 'undefined') {
        try {
            const customer = await stripe.customers.create({
                email: user?.email,
                name: user?.first_name + ' ' + user.last_name,
            });

            await prisma.user.update({
                where: {
                    username: username as string,
                },
                data: {
                    stripe_token: customer.id,
                },
            });
        } catch (error) {
            console.error('Error during customer creation:', error);
            return {
                status: 500,
                body: { message: 'Internal Server Error.' },
            };
        }
    }
    return user;
};

export const actions = {
    update: async ({ cookies, request }) => {
        const type = await request.json();
        try {
            cookies.set('paymentPlan', type, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });
        } catch (verificationError) {
            return fail(400);
        }
    },
    cancel: async ({ cookies, request }) => {
        const username = cookies.get('sessionId');
        try {
            cookies.set('paymentPlan', '4', {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });
        } catch (verificationError) {
            return fail(400);
        }
        user = await prisma.user.findUnique({
            where: {
                username: username as string,
            },
        });
        if (!user) {
            return {
                status: 404,
                body: { message: 'User not found.' },
            };
        }
        const customerId = user?.stripe_token;
        if (!customerId) {
            return {
                status: 404,
                body: { message: 'Customer not found.' },
            };
        }

        await prisma.user.update({
            where: {
                username: username as string,
            },
            data: {
                membership_type: 4,
                subscription_id: 'NaN',
            },
        });
        const subscriptions = await stripe.subscriptions.list({
            limit: 3,
            customer: customerId,
        });
        const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
            cancel_at_period_end: true,
        });
        location.reload;
    },
};
