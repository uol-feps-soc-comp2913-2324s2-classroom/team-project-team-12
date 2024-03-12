<script lang="ts">
  export let people: { id: number, name: string }[] = [];
  export let filterText: string = '';

  function filterPeople() {
    return people.filter((person: { id: number, name: string }) =>
      person.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  const addFriend = async (userId1, userId2) => {
    const formData = new FormData();
    formData.append('type', 'addFriend');
    formData.append('userId1', userId1.toString());
    formData.append('userId2', userId2.toString());

    try {
        const response = await fetch('/admin', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message || 'Friend added successfully');
        } else {
            console.error(result.error || 'Failed to add friend');
        }
    } catch (error) {
        console.error('Error during friend addition:', error);
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
        <button on:click={() => addFriend(3,4)} class="add-button">Add</button>
      </li>
    {/each}
  </ul>
</div>