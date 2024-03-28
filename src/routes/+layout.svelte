<script lang="ts">
    export let showButton = true;
    import home from '$lib/home.png';
    import { goto } from '$app/navigation';
    
    function navigateHome(){
        goto('/demo');
    }
</script>

<nav>
    <a href="/demo">home</a>
    <a href="/friends">friends</a>
    <a href="/account">account</a>
    <a href="/admin">admin</a>
    <a href="/login">login</a>
    <a href="/groups">groups</a>
</nav>

{#if showButton}
    <div class="home-tab">
        <button class="home-button" on:click={navigateHome}><img class="more" src={home} alt="home"><div class ="img-text">Home</div></button>
    </div>
{/if}

<slot />

<style>
    .home-tab {
        position: fixed;
        top: 0; 
        left: 0; 
        width: 8vh; 
        height: 8vh;
        z-index: 100;
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #1c1c1c;
        border-bottom-right-radius: 25px; 
        background-color: #ffffff;
        box-shadow: 0 10px 5px -5px rgba(0, 0, 0, 0.5); 
        overflow: hidden; 
    }

    .more {
        width: 30px; 
        height: 30px;
    }

    .home-button {
        border: none;
        background-color: transparent;
        padding: 10%; 
    }
</style>