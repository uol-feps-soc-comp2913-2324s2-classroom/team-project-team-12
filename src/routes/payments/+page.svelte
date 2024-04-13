<script lang="ts">
    import Weekly from './weekly.svelte'
    import Monthly from './monthly.svelte'
    import Annual from './annual.svelte'

    import type { PageData }  from './$types';

    export let data: PageData;
    const typedData = data as { membership_type?: number };
    const typedData2 = data as { subscription_start_date?: Date};
    const subscription_start_date = typedData2 ? typedData2.subscription_start_date : null;
    let next_payment_date = new Date()
    const membership_type = typedData ? typedData.membership_type : null;
    let registerMessage = ""

    const handleCancel = async () => {
        try {
            const response = await fetch('?/cancel', {
                method: 'POST',
                body: 'cancel',
            });

        } catch (error) {
            console.error('Error during update:', error);
            registerMessage = 'Internal Server Error';
        }

    }

    let plan = '';

    if (membership_type === 0) {
        plan = 'weekly';
        next_payment_date.setDate(subscription_start_date!.getDate() + 7);
    } else if (membership_type === 1) {
        plan = 'monthly';
        next_payment_date.setMonth(subscription_start_date!.getMonth() + 1);
    } else if (membership_type === 2) {
        plan = 'annual';
        next_payment_date.setFullYear(subscription_start_date!.getFullYear() + 1);
    } else {
        plan = 'unselected';
    }

</script>

<body>
    <br>
    <h1><center> Payment Plans </center></h1>
    <h3 style="text-transform:uppercase"><center>current Plan: {plan}</center></h3>
    {#if plan != 'unselected'}
        <h3 style="text-transform:uppercase"><center>Next Payment: {next_payment_date.toLocaleDateString("en-uk")}</center></h3>
    {/if}
    <br>
    <div class="flex">
        <Weekly bind:plan/>
        <Monthly bind:plan/>
        <Annual bind:plan/>
    </div>
    {#if plan !='unselected'}
        <br>
        <br>
        <center><button on:click={handleCancel}>Cancel Subscription</button></center>
    {/if}
    
</body>


<style>
    h1{
        font-size: 225%;
    }
    body{
        font-family: "Poppins";
    }
    .flex{
		display: flex;
		justify-content: space-evenly;
        height:100%;
	}
    button{
        font-family: "Poppins";
        font-size: 125%;
        font-weight: bold;
        border-radius: 12px;
        border: 1px solid;
        background-color: lavender;
        padding: 2.5% 3%;
    }
    button:hover{
        background-color:rgb(241, 241, 255);
    }
    button:active{
        background-color: rgb(210, 210, 230);
    }
</style>
