<script>
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
</script>

<table>
    <tr>
        <td>USERNAME<br>{username}</td>
        <td><button>Edit</button></td>
    </tr>
    <tr>
        <td>PASSWORD<br>••••••••••</td>
        <td><button>Edit</button></td>
    </tr>
    <tr>
        <td>PAYMENT<br>$5.99/month</td>
        <td><button>Switch</button></td>
    </tr>
    <tr>
        <td>PRIVACY<br>{privacy}</td>
        <td><button>Edit</button></td>
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