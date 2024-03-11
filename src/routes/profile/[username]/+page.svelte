<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte';
  import profilepicture from "$lib/profile-picture.png";

  import type { PageData }  from './$types';
  export let data: PageData;
  const user = data as { username?: string };

  let activeTab = 'Friends';
  let tabs = ['Friends', 'Groups', 'Routes'];

  function setActiveTab(tab) {
    activeTab = tab;
  }

</script>

<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
 
<style>

    body {
        overflow: hidden; /* Hide scrollbars */
    }
    
    .container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .profile-picture { 
        display: inline-block; 
        position: relative; 
        width: 20vh; 
        height: 20vh; 
        overflow: hidden; 
        border-radius: 50%; 
        margin-bottom: 20px;
        border: 1px solid #ccc;
    } 
        
    .profile-picture img { 
        width: auto; 
        height: 100%; 
    }
  
    .profile-container {
        display: flex;
        flex-direction: column;
        width: 40%;
        height: 60%;
    }
  
    .tabs {
        display: flex;
        justify-content: space-between;
        border-radius: 5px 5px 0 0;
    }
  
    .tab {
        padding: 10px 15px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        border-radius: 5px 5px 0 0;
        width: 33.3333%;
        text-align: center;
        font-family: "Poppins";
    }
  
    .tab:hover {
        background-color: #ddd;
    }
  
    .tab.active {
        background-color: white;
        border-bottom: 1px solid white;
    }
  
    .tab-content {
        border: 1px solid #ccc;
        border-radius: 0 0 5px 5px;
        border-top: none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .name{
        font-size: 20px;
        font-family: "Poppins";
    }

    .username{
        font-size: 10px;
        font-family: "Poppins";
        color: #1c1c1c;
        margin-bottom: 10px;
    }
</style>

<body>
  <div class="container">
    <div class="profile-picture"> <img src={profilepicture} alt="" /></div>
    <div class="name">{user.first_name} {user.last_name}</div>
    <div class="username">@{user.username} <i class="fa-solid fa-plus"></i></div>
    <div class="profile-container">
      <div class="tabs">
        {#each tabs as tab}
          <button class="tab" class:active={activeTab === tab} on:click={() => setActiveTab(tab)}>{tab}</button>
        {/each}
      </div>
      <div class="tab-content">
        {#if activeTab === 'Routes'}
        <p>This is content for User Data.</p>
        {:else if activeTab === 'Groups'}
        <p>This is content for User Groups.</p>
        {:else if activeTab === 'Friends'}
        <p>This is content for User Friends.</p>
        {/if}
      </div>
    </div>
  </div>
</body>