<script lang="ts">
    import Weekly from './weekly.svelte'
    import Monthly from './monthly.svelte'
    import Annual from './annual.svelte'

    import type { PageData }  from './$types';

    export let data: PageData;
    const typedData = data as { membership_type?: number };
    const membership_type = typedData ? typedData.membership_type : null;

    let plan = '';

    if (membership_type === 0) {
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
    <br>
    <h1><center> Payment Plans </center></h1>
    <h3 style="text-transform:uppercase"><center>current Plan: {plan}</center></h3>
    <br>
    <div class="flex">
        <Weekly bind:plan/>
        <Monthly bind:plan/>
        <Annual bind:plan/>
    </div>
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
</style>
