<script lang="ts">
    // @ts-nocheck
    export let data;
    export const user = data.user;
    export const userFriends = data.friends;
    export const userGroups = data.groupsWithMembersCount;
    export const friendCount = data.friendCount;
    export const groupCount = data.groupCount;
    export const isFriend = data.isFriend;
    export const friendRequest = data.friendRequest;
    export const profile = data.profile;

    let activeTab = 'Friends: ' + friendCount;
    let tabs = ['Friends: ' + friendCount, 'Groups: ' + groupCount, 'Routes'];
    let privacy = 1;

    function setActiveTab(tab) {
        activeTab = tab;
    }

    function hashUserId(userId) {
        return (userId * 2654435761) % Math.pow(2, 32); 
    }

    function getRandomColor(userId) {
        const hashedUserId = hashUserId(userId);
        const color = hashedUserId.toString(16).slice(-6); 
        return color;
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    function getDefaultProfilePictureUrl(user) {
        const initials = getInitials(user.first_name, user.last_name);
        const color = getRandomColor(user.id);
        const imageSize = 200; 
        const imageUrl = `https://ui-avatars.com/api/?name=${initials}&background=${color}&size=${imageSize}`;
        return imageUrl;
    }

    function getDefaultGroup(group) {
        const color = getRandomColor(group.id);
        const imageSize = 200; 
        const imageUrl = `https://ui-avatars.com/api/?name=${group.name}&background=${color}&size=${imageSize}`;
        return imageUrl;
    }

    const userPictureUrl = getDefaultProfilePictureUrl(user);

    const profilePictureUrls = userFriends.map(user => getDefaultProfilePictureUrl(user))

    
    const groupPictureUrls = userGroups.map(group => getDefaultGroup(group));

    export let people: { id: number, name: string, first_name: string, last_name: string }[] = [];

    const addFriend = async (person: { id: number, name: string }) => {
        const formData = new FormData();
        formData.append('type', 'addFriend');
        formData.append('id', person.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Friend request sent');
                people = people.filter(f => f.id !== person.id);
                window.location.reload();
            } else {
                console.error(result.error || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error during sending request:', error);
        }
    };

    export let currentUserFriends: { id: number, name: string }[] = [];

    const deleteFriend = async (friend: { id: number, name: string }) => {
        const formData = new FormData();
        formData.append('type', 'deleteFriend');
        formData.append('id', friend.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Friend deleted successfully');
                currentUserFriends = currentUserFriends.filter(f => f.id !== friend.id);
                window.location.reload();
                
            } else {
                console.error(result.error || 'Failed to delete friend');
            }
        } catch (error) {
            console.error('Error during friend deletion:', error);
        }
    };

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

    .tab-content-priv {
        border: 1px solid #ccc;
        border-radius: 0 0 5px 5px;
        border-top: none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;  
        align-items: center;
        justify-content: center;
        flex-direction: column;
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
    }

    .add-button {
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        font-size: 10px;
        margin-left: 5px;
    }

    .request-button {
        padding: 5px 10px;
        background-color: #c4c4c4;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        font-size: 10px;
        margin-left: 5px;
    }

    .remove-button {
        padding: 5px 10px;
        background-color: #ff504a;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        font-size: 10px;
        margin-left: 5px;
    }

    .account-button {
        padding: 5px 10px;
        background-color: #696969;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        font-size: 10px;
        margin-left: 5px;
    }

    .add-button:hover {
        background-color: #0056b3;
    }

    .private-message {
        text-align: center;
        font-size: 18px;
        color: #1c1c1c;
        margin-bottom: 15px;
    }

    .request-button:hover {
        opacity: 0.75;
    }

    a {
        text-decoration: none;
    }

    .add-button{
        margin-left: 20px;
        font-size: 10px;
    }

</style>

<body>
  <div class="container">
    <div class="profile-picture"> <img src={userPictureUrl} alt="" /></div>
    <div class="name">{user.first_name} {user.last_name}</div>
    <div class="username">@{user.username}
        {#if user.username == profile.username}
            <a class="account-button" href="../../account">My Account</a>
        {:else if !isFriend && friendRequest == null}
            <button class="add-button" on:click={() => addFriend(user)} >Request</button>
        {:else if friendRequest?.friend_request }
            <button class="request-button" on:click={() => deleteFriend(user)} >Requested</button>
        {:else}
            <button class="remove-button" on:click={() => deleteFriend(user)} >Remove</button>
        {/if}
    </div>
    <div class="profile-container">
        <div class="tabs">
            {#each tabs as tab}
            <button class="tab" class:active={activeTab === tab} on:click={() => setActiveTab(tab)}>{tab}</button>
            {/each}
        </div>
        {#if privacy == 1}
        <div class="tab-content">
            {#if activeTab === 'Routes'}
                <p>This is content for User Data.</p>
            {:else if activeTab === 'Groups: ' + groupCount}
                <div class="friends-list">
                    {#each userGroups as group, i}
                        <a rel="external" href="../group/{group.name}">
                            <div class="friend">
                                <div class="friend-profile-picture">
                                    <img src={groupPictureUrls[i]} alt="" />
                                </div>
                                <div class="friend-details">
                                    <div class="friend-name">{group.name}</div>
                                    <div class="user-name">Members: {group.memberCount}</div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {:else if activeTab === 'Friends: '+ friendCount}
                <div class="friends-list">
                    {#each userFriends as friend, i}
                    <a rel="external" href="../profile/{friend.username}">
                        <div class="friend">
                            <div class="friend-profile-picture">
                                <img src={profilePictureUrls[i]} alt="" />
                            </div>
                            <div class="friend-details">
                                <div class="friend-name">{friend.first_name} {friend.last_name}</div>
                                <div class="user-name">@{friend.username}</div>
                            </div>
                        </div>
                    </a>
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <div class="tab-content-priv">
            <p class="private-message">This user's profile is private.</p>
            <button class="request-button">Send Request</button>
        </div>
    {/if}
    </div>
  </div>
</body>