<script lang="ts">
  export let people: { id: number, name: string }[] = [];
  export let filterText: string = '';
  export let friends: { id: number, name: string }[] = [];

  function filterPeople() {
    return people.filter((person: { id: number, name: string }) =>
      person.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  function addToFriends(person: { id: number, name: string }) {
    // Use the friends prop here
    console.log('Adding friend:', person);
    friends = [...friends, person]; // Add the person to the list of friends
    people = people.filter(p => p.id !== person.id); // Remove the person from the unadded list
    console.log('Updated unadded:', people);

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

