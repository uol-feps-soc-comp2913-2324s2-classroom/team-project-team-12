import { stripe } from '$lib/stripe';

export async function post(request) {
    const event = request.body;

    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;

        // Get the user associated with this invoice
        const user = await getUserByStripeCustomerId(invoice.customer);

        if (user) {
            const nextPaymentDate = new Date(invoice.lines.data[0].period.end * 1000);

            await updateUserNextPaymentDate(user.id, nextPaymentDate);
        }
    }

    // Return a response to acknowledge receipt of the event
    return {
        status: 200,
        body: { received: true },
    };
}
