<script lang="ts">
    // @ts-nocheck
    export let data;
    export const group = data.group;
    export const members = data.members;
    export const creator = data.creator;

    let activeTab = 'Members';
    let tabs = ['Members', 'Routes'];

    function setActiveTab(tab) {
        activeTab = tab;
    }

    function hashUserId(userId) {
        return (userId * 2654435761) % Math.pow(2, 32); 
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    function getRandomColor(userId) {
        const hashedUserId = hashUserId(userId);
        const color = hashedUserId.toString(16).slice(-6); // Convert to hexadecimal and take the last 6 characters
        return color;
    }

    function getDefaultProfilePictureUrl(user) {
        const initials = getInitials(user.first_name, user.last_name);
        const color = getRandomColor(user.id);
        const imageSize = 200; // Adjust this size according to your requirement
        const imageUrl = `https://ui-avatars.com/api/?name=${initials}&background=${color}&size=${imageSize}`;
        return imageUrl;
    }

    function getDefaultGroup(group) {
        const color = getRandomColor(group.id);
        const imageSize = 200; // Adjust this size according to your requirement
        const imageUrl = `https://ui-avatars.com/api/?name=${group.name}&background=${color}&size=${imageSize}`;
        return imageUrl;
    }

    const groupUrl = getDefaultGroup(group);

    const memberPictureUrls = members.map(user => getDefaultProfilePictureUrl(user))

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
        width: 50%;
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

    .friend {
        display: flex;
        align-items: center;
        margin: 20px;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 5px;
    }

    .friend-profile-picture {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 15px;
    }

    .friend-profile-picture img {
        width: 100%;
        height: 100%;
    }

    .friend-details {
        display: flex;
        flex-direction: column;
    }

    .friend-name {
        font-size: 16px;
        font-family: "Poppins";
        color: #1c1c1c;
    }

    .user-name {
        font-size: 13px;
        font-family: "Poppins";
        color: #1c1c1c;
        margin-bottom: 10px;
    }

    .button-container {
        margin-left: auto; /* Moves the button to the far right */
    }

    .add-button {
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        font-size: 14px;
    }

    .add-button:hover {
        background-color: #0056b3;
    }

    a {
        text-decoration: none;
    }
</style>

<body>
  <div class="container">
    <div class="profile-picture"> <img src={groupUrl} alt="" /></div>
    <div class="name">{group.name}</div>
    <div class="profile-container">
        <div class="tabs">
            {#each tabs as tab}
            <button class="tab" class:active={activeTab === tab} on:click={() => setActiveTab(tab)}>{tab}</button>
            {/each}
        </div>
        <div class="tab-content">
            {#if activeTab === 'Members'}
                {#each members as members, i}
                    <a rel="external" href="../profile/{members.username}">
                        <div class="friend">
                            {#if members.username == creator.username}
                            d
                            {/if}
                            <div class="friend-profile-picture">
                                <img src={memberPictureUrls[i]} alt="" />
                            </div>
                            <div class="friend-details">
                                <div class="friend-name">{members.first_name} {members.last_name}</div>
                                <div class="user-name">@{members.username}</div>
                            </div>
                            <div class="button-container">
                                <button class="add-button">Add</button>
                            </div>
                        </div>
                    </a>
                {/each}
            {:else if activeTab === 'Routes'}
                <p>This is content for User Data.</p>   
            {/if}        
        </div>  
    </div>
  </div>
</body>