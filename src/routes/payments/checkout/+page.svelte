<script>
    import { PUBLIC_STRIPE_KEY } from '$env/static/public';
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, PaymentElement } from 'svelte-stripe';

    export let data;

    $: ({ clientSecret, returnUrl } = data);

    let stripe;

    let elements;

    onMount(async () => {
        stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    });

    async function submit() {
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl,
            },
        });

        if (error) {
            console.error(error);
        }
    }
</script>

<body>
    <h1>Payment</h1>
    {#if stripe}
        <form on:submit|preventDefault={submit}>
            <Elements {stripe} {clientSecret} bind:elements>
                <PaymentElement />
            </Elements>
            <br />
            <button>Pay</button>
        </form>
    {:else}
        Loading Stripe...
    {/if}
</body>

<style>
    h1 {
        font-size: 225%;
    }
    body {
        font-family: 'Poppins';
    }
    button {
        font-family: 'Poppins';
        font-size: 115%;
        font-weight: bold;
        border-radius: 12px;
        border: 1px solid;
        background-color: lavender;
        padding: 0.5% 1.5%;
    }
</style>
