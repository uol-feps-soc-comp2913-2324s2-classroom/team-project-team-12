<script lang="ts">

    export let groupRequests: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }[] = [];

    let searchTerm = "";
    
    const acceptRequest = async ( group: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} } ) => {
      const formData = new FormData();
      formData.append('type', 'acceptRequest');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Group request accepted');
              groupRequests = groupRequests.filter(r => r.id !== group.id);
              location.reload();
              
          } else {
              console.error(result.error || 'Failed to accept request');
          }
      } catch (error) {
          console.error('Error when accepting request:', error);
      }
  };

  const declineRequest = async ( group: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }) => {
      const formData = new FormData();
      formData.append('type', 'declineFriend');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/friends', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Friend accepted successfully');
              friendRequests = friendRequests.filter(f => f.id !== request.id);
              location.reload();
          } else {
              console.error(result.error || 'Failed to accept friend');
          }
      } catch (error) {
          console.error('Error during friend acception:', error);
      }
  };

  
  
  
  $: filteredGroups = groupRequests.filter(request =>
      request.users.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
   
  
  </script>
  
  <style>
    ul {
      list-style: none;
      padding: 0;
    }
  
    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .profile-pic {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ccc;
      margin-right: 10px;
    }
  
    .accept-button {
      margin-left: 10px;
      padding: 5px 10px;
      background-color: #000a0641;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .decline-button {
      margin-left: 10px;
      padding: 5px 10px;
      background-color: #000a0641;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
  </style>
  
  {#if groupRequests.length > 0}
  <div>
    <input type="text" placeholder="Your Groups' Requests" bind:value={searchTerm} />
    <ul>
      {#each filteredGroups as group}
        <li>
          <div style="display: flex; flex-direction: column;">
            <span>{group.users.username}</span>
            <p style="font-size: 0.8em; margin-top: 0.3em;">Group: {group.groups.name}</p>
          </div>
          <button on:click={() => acceptRequest(group)} class="accept-button">Accept</button>
          <button on:click={() => declineRequest(group)} class="decline-button">Decline</button>
        </li>
      {/each}
    </ul>
  </div>
{/if}


