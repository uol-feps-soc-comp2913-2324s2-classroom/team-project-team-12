<script>
  export let people = [];
  export let filterText = '';

  function filterPeople() {
    return people.filter(person =>
      person.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  function addToFriends(person) {
    // Function for adding friends not implemented yet
    console.log('Add', person.name, 'to friends list');
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
    /*justify-content: space-between;  Align items evenly in row */
    margin-bottom: 10px;
  }

  .profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 10px;
  }

  .add-button {
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
    {#each filterPeople() as person}
      <li>
        <div class="profile-pic"></div>
        <span>{person.name}</span>
        <button on:click={() => addToFriends(person)} class="add-button">Add</button>
      </li>
    {/each}
  </ul>
</div>
