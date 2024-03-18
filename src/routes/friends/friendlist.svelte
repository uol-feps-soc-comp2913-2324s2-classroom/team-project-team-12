<script lang="ts">
  export let currentUserFriends: { id: number, name: string }[] = [];
  let searchTerm = "";

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
            location.reload();
            
        } else {
            console.error(result.error || 'Failed to delete friend');
        }
    } catch (error) {
        console.error('Error during friend deletion:', error);
    }
};


$: filteredFriends = currentUserFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  import { getDefaultProfilePictureUrl } from './pfp.js';

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

  .delete-button {
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
  <input type="text" placeholder="Search Friends" bind:value={searchTerm} />
  <ul>
    {#each filteredFriends as friend}
      <li>
        <a rel="external" href="../profile/{friend.name}">
          <img class = "profile-pic "src={getDefaultProfilePictureUrl(friend)} alt="" />
        </a>
        <span>{friend.name}</span>
        <button on:click={() => deleteFriend(friend)} class="delete-button">Delete</button>
      </li>
    {/each}
  </ul>
</div>