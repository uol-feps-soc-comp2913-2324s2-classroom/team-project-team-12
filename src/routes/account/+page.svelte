<script>
    import Data from './data.svelte';
    import profilepic from '$lib/pfp.png'
</script>

<div class="account-info">
    <div class="header">
        <div class="name">
            <h1>@</h1>
        </div>
        <div class="picture">
            <img src="{profilepic}" alt="">
        </div>
    </div>
    <div class="data">
        <Data />
    </div>
</div>

<style>
    .account-info {
        height: 650px;
        width: 500px;
        margin: auto auto;
        background-color: white;
        box-shadow: 8px 8px 20px #a8b6ae;
        border-radius: 50px;
        position: relative;
        overflow: hidden;
    }

    .header {
        margin: 30px;
        justify-content: space-between;
        display: flex;
    }

    .name, .picture {
        position: relative;
    }

    .data {
        margin: 30px;
    }

    img {
        max-width: 75px;
        max-height: 75px;
    }
</style>