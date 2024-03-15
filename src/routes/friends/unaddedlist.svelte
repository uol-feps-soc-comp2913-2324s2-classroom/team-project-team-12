<script lang="ts">
  export let people: { id: number, name: string, first_name: string, last_name: string }[] = [];
  let searchTerm = "";

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
        } else {
            console.error(result.error || 'Failed to send request');
        }
    } catch (error) {
        console.error('Error during sending request:', error);
    }
};

$: filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  <input type="text" placeholder="Search People" bind:value={searchTerm} />
  <ul>
    {#each filteredPeople as person}
      <li>
        <img class = "profile-pic "src={getDefaultProfilePictureUrl(person)} alt="" />
        <span>{person.name}</span>
        <button on:click={() => addFriend(person)} class="add-button">Add</button>
      </li>
    {/each}
  </ul>
</div>