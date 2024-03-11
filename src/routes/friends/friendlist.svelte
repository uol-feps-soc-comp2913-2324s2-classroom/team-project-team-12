<script lang="ts">
  export let friends: { id: number, name: string }[] = [];
  export let filterText = '';

  function filterFriends() {
    return friends.filter((friend: { id: number, name: string }) =>
      friend.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  function deleteFromFriends(friend: { id: number, name: string }) {
    console.log('Deleted friend:', friend);
    friends = friends.filter(f => f.id !== friend.id); // Reassign the filtered array
    console.log('Updated friends:', friends);
}


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
    {#each filterFriends() as friend}
      <li>
        <div class="profile-pic"></div>
        <span>{friend.name}</span>
        <button on:click={() => deleteFromFriends(friend)} class="delete-button">Delete</button>
      </li>
    {/each}
  </ul>
</div>