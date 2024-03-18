<script>
    import { Modal, Content, Trigger}  from "sv-popup";
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
</script>

<table>
    <tr>
        <td>USERNAME<br>{username}</td>
        <td>
            <Modal basic>
                <Content>
                    <EditUsername />
                </Content>
                <Trigger>
                    <button>Edit</button>
                </Trigger>
            </Modal>
        </td>
    </tr>
    <tr>
        <td>PASSWORD<br>••••••••••</td>
        <td>
            <Modal basic>
                <Content>
                    <EditPassword />
                </Content>
                <Trigger>
                    <button>Edit</button>
                </Trigger>
            </Modal>
        </td>
    </tr>
    <tr>
        <td>PAYMENT<br>$5.99/month</td>
        <td><button on:click={switchPayment}>Switch</button></td>
    </tr>
    <tr>
        <td>PRIVACY<br>{privacy}</td>
        <td>
            <Modal basic>
                <Content>
                    <EditPrivacy />
                </Content>
                <Trigger>
                    <button>Edit</button>
                </Trigger>
            </Modal>
        </td>
    </tr>
</table>

<style>
    table {
        border-spacing: 25px;
    }

    td{
        padding-right: 225px;
    }
</style>