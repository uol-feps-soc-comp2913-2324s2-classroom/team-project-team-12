<script>
    import { Button } from 'flowbite-svelte';
    import { UserOutline, LockOutline, DollarOutline, VideoCameraOutline } from 'flowbite-svelte-icons';
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

<div class="flex items-center space-x-4 rtl:space-x-reverse">
    <table>
        <tr>
            <td style="display:flex;">
                <UserOutline size="lg" color="orange" style="margin-right: 10px;"></UserOutline>
                <div>
                    <span>USERNAME</span><br>
                    <span>@{username}</span>
                </div>
            </td>
            <td style="padding-right: 10px;">
                <EditUsername />
            </td>
        </tr>
        <tr>
            <td style="display:flex;">
                <LockOutline size="lg" color="orange" style="margin-right: 10px;"></LockOutline>
                PASSWORD<br>•••••••</td>
            <td style="padding-right: 10px;">
                <EditPassword />
            </td>
        </tr>
        <tr>
            <td style="display:flex;">
                <DollarOutline size="lg" color="orange" style="margin-right:10px;"></DollarOutline>
                PAYMENT PLAN <br>{plan}</td>
            <td style="padding-right: 10px;"><Button color="light" on:click={switchPayment}>Edit</Button></td>
        </tr>
        <tr>
            <td style="display:flex;">
                <VideoCameraOutline size="lg" color="orange" style="margin-right: 10px;"></VideoCameraOutline>
                PRIVACY<br>{privacy}</td>
            <td style="padding-right: 10px;">
                <EditPrivacy />
            </td>
        </tr>
    </table>
</div>

<style>
    table {
        border-collapse: collapse;
        width: 100%;
        border-spacing: 25px;
    }

    td{
        align-items: center;
        white-space: nowrap;
        padding-bottom: 10px;
        padding-right: 100px;
        padding-top: 10px;
    }
</style>