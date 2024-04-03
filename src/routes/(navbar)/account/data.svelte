<script>
    import { Button } from 'flowbite-svelte';
    import EditUsername from './edituser.svelte';
    import EditPassword from './editpass.svelte';
    import EditPrivacy from './editprivacy.svelte';
    import { goto } from '$app/navigation';
    
    export let user;
    const username = user ? user.username : null;
    const membershiptype = user ? user.membership_type : null;
    const publicity = user ? user.default_publicity : null;

    let privacy = 'Private';
    if(publicity==1){
        privacy = 'Friends Only';
    }else if(publicity==2){
        privacy = 'Public';
    }

    function switchPayment(){
        goto('/payments');
    }

    let plan = 'None';
    if(membershiptype === 1){
        plan = "Weekly";
    }else if(membershiptype === 2){
        plan = "Monthly";
    }else if(membershiptype === 3){
        plan = "Annually";
    }

</script>

<table>
    <tr>
        <td class="text-gray-900 dark:text-white">USERNAME<br>{username}</td>
        <td>
            <EditUsername />
        </td>
    </tr>
    <tr>
        <td>PASSWORD<br>••••••••••</td>
        <td>
            <EditPassword />
        </td>
    </tr>
    <tr>
        <td>PAYMENT<br>{plan}</td>
        <td><Button on:click={switchPayment}>Switch</Button></td>
    </tr>
    <tr>
        <td>PRIVACY<br>{privacy}</td>
        <td>
            <EditPrivacy />
        </td>
    </tr>
</table>

<style>
    table {
        border-spacing: 25px;
    }

    td{
        padding-bottom: 25px;;
        padding-right: 125px;
    }
</style>