import prisma  from '$lib/prisma';
import type { user } from '$lib/interfaces'
import { fail } from '@sveltejs/kit';
import { stripe } from '$lib/stripe'

let user: user

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

    if (user?.stripe_token === "undefined"){
        try {
            const customer = await stripe.customers.create({
                email: user?.email,
                name: user?.first_name + " " + user.last_name
              })

            await prisma.user.update({
                where: {
                    username: username as string,
                },
                data: {
                    stripe_token: customer.id,
                },
            })
        }
        catch (error) {
            console.error('Error during customer creation:', error);
            return {
                status: 500,
                body: { message: 'Internal Server Error.' },
            };
        }
    }
    return user;
});

export const actions = {
    update: async ({ cookies, request }) => {
        const type = await request.json();
        try {
            cookies.set('paymentPlan', type, {
              httpOnly: true,
              sameSite: 'strict',
              secure: false,
              path: '/',
              maxAge: 60 * 60 * 24 * 7
            });
          } catch (verificationError) {
            return fail(400);
          }
    },
    cancel: async ({ cookies, request }) => {
        const username = cookies.get('sessionId');
        user = await prisma.user.findUnique({
            where: {
            username: username as string,
            },
        });
        const subscriptionId = user?.subscription_id;
        const customerId = user?.stripe_token;
        const subscriptions = await stripe.subscriptions.list({
            limit: 3,
            customer: customerId,
        });
        console.log(subscriptions.data[0].id);
        const subscription = await stripe.subscriptions.update(
            subscriptions.data[0].id,
            {
                cancel_at_period_end: true,
            }
        )
        try {
            await prisma.user.update({
                where: {
                    username: username as string,
                },
                data: {
                    membership_type: 4,
                    subscription_id: "",
                },
            })
        }
        catch (error) {
            console.error('Error during cancellation update:', error);
            return {
                status: 500,
                body: { message: 'Internal Server Error.' },
            };
        }
        location.reload;

    }

}