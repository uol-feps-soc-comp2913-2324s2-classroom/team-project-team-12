import { stripe } from '$lib/stripe'
import prisma from '$lib/prisma';
import { env } from '$env/dynamic/private'
import { fail } from '@sveltejs/kit';
import type { user } from '$lib/interfaces'
import { redirect } from '@sveltejs/kit'

let user: user

export const load = (async ({ cookies }) => {
  const username = cookies.get('sessionId');
  const type = Number(cookies.get('paymentPlan'));

  user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  });

  if(type === user?.membership_type){
    throw redirect(303, '/payments')
  }

  const customerId = user?.stripe_token;
  const subscriptionId = user?.subscription_id;
  let priceId = '';

  if (type === 0) {
    priceId = 'price_1OtcJiDlKfh3GBPNwY2Ikbx9';
  } else if (type === 1) {
    priceId = 'price_1OtcJxDlKfh3GBPNu3P94nC5';
  } else if (type === 2) {
    priceId = 'price_1OtcKHDlKfh3GBPNWR74idCD';
  }
  
  if(subscriptionId === "undefined" || subscriptionId === ""){
    const subscription = await stripe.subscriptions.create({
      customer: customerId!,
      items: [
        {
          price: priceId
        }
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })

    try {
      cookies.set('subscriptionId', subscription.items.data[0].id, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    } catch (verificationError) {
      return fail(400);
    }
  
    return {
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      returnUrl: new URL('/payments/complete', env.DOMAIN).toString()
    }

  } else {
    const subscription = await stripe.subscriptionItems.update(
      subscriptionId!,
      {
        price: priceId,
        proration_behavior: 'always_invoice',
      }
    );
    const currentDate = new Date()
    try {
      await prisma.user.update({
          where: {
              username: username as string,
          },
          data: {
              membership_type: Number(type),
              subscription_start_date: currentDate.toISOString(),
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
    throw redirect(303, '/payments')
  }
  
});