<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import profilepicture from "$lib/profile-picture.png";
    let activeTab = 'Profile';
    let tabs = ['Profile', 'Groups', 'Friends', 'Routes'];
  
    onMount(() => {
      setActiveTabContent(activeTab);
    });
  
    function setActiveTab(tab) {
      activeTab = tab;
      setActiveTabContent(tab);
    }
  
  </script>
  
  <style>
    .container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .profile-picture { 
        display: inline-block; 
        position: relative; width: 200px; 
        height: 200px; overflow: hidden; 
        border-radius: 50%; 
        margin-bottom: 20px;
    } 
        
    .profile-picture img { 
        width: auto; 
        height: 100%; 
        margin-left: -40px; 
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
        width: 25%;
        text-align: center;
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
  </style>
  
  <div class="container">
    <div class="profile-picture"> <img src={profilepicture} alt="profile picture" /> </div>
    <div class="profile-container">
      <div class="tabs">
        {#each tabs as tab}
        <button class="tab" class:active={activeTab === tab} on:click={() => setActiveTab(tab)}>{tab}</button>
        {/each}
      </div>
      <div class="tab-content">
        {#if activeTab === 'Profile'}
        <p>This is content for User Data.</p>
        {:else if activeTab === 'Groups'}
        <p>This is content for User Groups.</p>
        {:else if activeTab === 'Friends'}
        <p>This is content for User Friends.</p>
        {:else if activeTab === 'Routes'}
        <p>This is content for User Routes.</p>
        {/if}
      </div>
    </div>
  </div>