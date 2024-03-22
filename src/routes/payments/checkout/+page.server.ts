import { stripe } from '$lib/stripe'
import prisma from '$lib/prisma';
import { env } from '$env/dynamic/private'
import type { user } from '$lib/interfaces'

let user: user

export const load = (async ({ cookies }) => {
  const username = cookies.get('sessionId');
  const type = Number(cookies.get('paymentPlan'));

  user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  });


  const customerId = user?.stripe_token;
  let priceId = '';

  if (type === 0) {
    priceId = 'price_1OtcJiDlKfh3GBPNwY2Ikbx9';
  } else if (type === 1) {
    priceId = 'price_1OtcJxDlKfh3GBPNu3P94nC5';
  } else if (type === 2) {
    priceId = 'price_1OtcKHDlKfh3GBPNWR74idCD';
  }

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

  return {
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    returnUrl: new URL('/payments/complete', env.DOMAIN).toString()
  }
});