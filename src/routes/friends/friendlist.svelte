<script lang="ts">
  import type { user } from '$lib/interfaces'
  export let currentUserFriends: { id: number, name: string }[] = [];
  export let filterText = '';


  const deleteFriend = async (friend: { id: number, name: string }) => {
    console.log("Hello");
    const formData = new FormData();
    formData.append('type', 'deleteFriend');
    formData.append('id', friend.id.toString());
    //console.log(friend.id);
    if (friend.name) formData.append('username', friend.name);

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
  <ul>
    {#each currentUserFriends as friend}
      <li>
        <div class="profile-pic"></div>
        <span>{friend.name}</span>
        <button on:click={() => deleteFriend(friend)} class="delete-button">Delete</button>
      </li>
    {/each}
  </ul>
</div>