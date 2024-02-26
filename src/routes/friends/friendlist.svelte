<script>
  export let friends = [];
  export let filterText = '';

  function filterFriends() {
    return friends.filter(friend =>
      friend.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  function deleteFromFriends(friend) {
    // Function for deleting friends not implemented yet
    console.log('Delete', friend.name, 'to friends list');
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
