<script>
    import { onMount } from 'svelte';
</script>

<table>
    <tr>
        <td>USERNAME<br></td>
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
        <td>PRIVACY<br>Public</td>
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