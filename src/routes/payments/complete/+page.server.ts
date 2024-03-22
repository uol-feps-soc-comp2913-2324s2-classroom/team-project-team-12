import { stripe } from '$lib/stripe'
import { redirect } from '@sveltejs/kit'
import prisma from '$lib/prisma';

export async function load({ cookies, url }) {
    const username = cookies.get('sessionId');
    const type = cookies.get('paymentPlan');
    const subscriptionId = cookies.get('subscriptionId');
    const id = url.searchParams.get('payment_intent')
    const paymentIntent = await stripe.paymentIntents.retrieve(id)
    const currentDate = new Date()

    let message

    switch (paymentIntent.status) {
        case 'succeeded':
            try {
                await prisma.user.update({
                    where: {
                        username: username as string,
                    },
                    data: {
                        membership_type: Number(type),
                        last_payment: currentDate.toISOString(),
                        subscription_id: subscriptionId,
                    },
                })
                message = 'Success! Payment received.'
            }
            catch (error) {
                console.error('Error during membership type update:', error);
                return {
                    status: 500,
                    body: { message: 'Internal Server Error.' },
                };
            }
            break
        case 'processing':
            message = "Payment processing. We'll update you when payment is received."
            break

        case 'requires_payment_method':
            throw redirect(303, '/payments/checkout')

        default:
            message = 'Something went wrong'
            break
    }
    cookies.delete('paymentPlan', { path: '/' });
    return { message }
}