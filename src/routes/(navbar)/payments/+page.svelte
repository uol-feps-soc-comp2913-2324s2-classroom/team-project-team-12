<script lang="ts">
    import Weekly from './weekly.svelte';
    import Monthly from './monthly.svelte';
    import Annual from './annual.svelte';
    import { Button, Heading, Secondary } from 'flowbite-svelte';

    import type { PageData } from './$types';
    import { redirect } from '@sveltejs/kit';

    export let data: PageData;
    let user = data.user;
    const typedData = data as { membership_type?: number };
    const typedData2 = data as { subscription_start_date?: Date };
    const subscription_start_date = typedData2 ? typedData2.subscription_start_date : null;
    let next_payment_date = data.user.next_payment_date;
    let membership_type = typedData ? typedData.membership_type : 4;
    let registerMessage = '';
    let currentTime = new Date();
    const handleCancel = async () => {
        console.log('cancel');
        try {
            const response = await fetch('?/cancel', {
                method: 'POST',
                body: 'cancel',
            });
        } catch (error) {
            console.error('Error during update:', error);
            registerMessage = 'Could not cancel subscription. Please try again later.';
        }
        location.reload();
        console.log('done');
    };

    let plan = '';
    if (!user) {
        redirect(404, '/login');
    }
    if (user.membership_type === 0) {
        plan = 'weekly';
    } else if (membership_type === 1) {
        plan = 'monthly';
    } else if (membership_type === 2) {
        plan = 'annual';
    } else {
        plan = 'unselected';
    }
</script>

<body>
    <br />
    <div class="top">
        <div class="leftRight">
            <Heading>Payment Plans</Heading>
            {#if plan != 'unselected'}
                <Button on:click={handleCancel}>Cancel Subscription</Button>
            {/if}
        </div>
        {#if user.next_payment_date != null}
            <Secondary style="text-transform:uppercase">Current Plan: {plan}</Secondary>
            {#if plan != 'unselected'}
                <Secondary style="text-transform:uppercase"
                    >Next Payment: {user.next_payment_date.toLocaleDateString('en-uk')}</Secondary
                >
            {:else}
                <Secondary style="text-transform:uppercase"
                    >Active Until {user.next_payment_date.toLocaleDateString('en-uk')}</Secondary
                >
            {/if}
        {:else}
            <Secondary style="text-transform:uppercase">No Active Subscription</Secondary>
        {/if}
    </div>
    <br />
    <div class="flex flex-col lg:flex-row">
        <Weekly {user} />
        <Monthly {user} />
        <Annual {user} />
    </div>
</body>

<style>
    .flex {
        display: flex;
        justify-content: space-around;
        padding: 2%;
        /* overflow-x: scroll; */
    }

    .leftRight {
        display: flex;
        justify-content: space-between;
    }

    .top {
        padding: 20px;
    }
</style>
