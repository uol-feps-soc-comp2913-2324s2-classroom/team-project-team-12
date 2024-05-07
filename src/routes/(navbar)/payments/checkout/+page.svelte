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
    {#if stripe}
        <h1 class="dark:text-white">Payment</h1>
        <form on:submit|preventDefault={submit}>
            <Elements {stripe} {clientSecret} bind:elements>
                <PaymentElement />
            </Elements>
            <br />
            <button>Pay</button>
        </form>
    {:else}
        <div
            class="fixed top-0 left-0 -z-10 w-screen h-screen flex flex-col dark:text-white justify-center items-center"
        >
            Loading Checkout...
        </div>
    {/if}
</body>

<style>
    h1 {
        font-size: 225%;
    }
    button {
        font-size: 115%;
        font-weight: bold;
        border-radius: 12px;
        border: 1px solid;
        background-color: lavender;
        padding: 0.5% 1.5%;
    }
</style>
