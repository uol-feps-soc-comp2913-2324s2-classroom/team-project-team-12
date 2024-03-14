<script lang="ts">
    let searchTerm = "";
    export let friendRequests: { id: number, name: string }[] = [];
  
  
    const acceptFriend = async (request: { id: number, name: string }) => {
      const formData = new FormData();
      formData.append('type', 'acceptFriend');
      formData.append('id', request.id.toString());
      console.log(friendRequests);
  
      try {
          const response = await fetch('/friends', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Friend deleted successfully');
          } else {
              console.error(result.error || 'Failed to delete friend');
          }
      } catch (error) {
          console.error('Error during friend deletion:', error);
      }
  };

  $: filteredRequests = friendRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  </style>
  
  <div>
    <input type="text" placeholder="Search Requests" bind:value={searchTerm} />
    <ul>
      {#each filteredRequests as request}
        <li>
          <div class="profile-pic"></div>
          <span>{request.name}</span>
          <button on:click={() => acceptFriend(request)} class="accept-button">Accept</button>
        </li>
      {/each}
    </ul>
  </div>