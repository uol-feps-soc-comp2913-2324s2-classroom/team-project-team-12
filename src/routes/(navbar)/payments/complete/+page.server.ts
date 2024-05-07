import { stripe } from '$lib/stripe'
import { redirect } from '@sveltejs/kit'
import prisma from '$lib/prisma';

export async function load({ cookies, url }) {
    const username = cookies.get('sessionId');
    let user = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    });
    if (!user) {
        return {
            status: 401,
            body: { message: 'Unauthorized' },
        };
    }
    const type = cookies.get('paymentPlan');
    const subscriptionId = cookies.get('subscriptionId');
    const id = url.searchParams.get('payment_intent')
    const paymentIntent = await stripe.paymentIntents.retrieve(id)
    const currentDate = new Date()
    let next_date = user?.next_payment_date
    if (next_date == null || (user.paid === false || (user.paid === true && currentDate > next_date)) ) {
      if (Number(type) == 0) {
        next_date = new Date(currentDate.setDate(currentDate.getDate() + 7))
      }
      if (Number(type) == 1) {
        next_date = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
      }
      if (Number(type) == 2) {
        next_date = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
      }
    }

    if (next_date != null) {
        next_date = next_date.toISOString();
    }

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
                        subscription_start_date: currentDate.toISOString(),
                        subscription_id: subscriptionId,
                        next_payment_date: next_date,
                        paid: true
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