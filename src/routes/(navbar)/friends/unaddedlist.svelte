<script lang="ts">
  import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
  export let people: { id: number, name: string, first_name: string, last_name: string }[] = [];
  export let requested: { id: number, name: string }[] = [];
  let searchTermPeople = "";
  let searchTermRequested = "";

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
            location.reload();
        } else {
            console.error(result.error || 'Failed to send request');
        }
    } catch (error) {
        console.error('Error during sending request:', error);
    }
  };

  const cancelRequest = async (requestedPerson: { id: number, name: string }) => {
    const formData = new FormData();
    formData.append('type', 'cancelRequest');
    formData.append('id', requestedPerson.id.toString());

    try {
        const response = await fetch('/friends', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message || 'Friend request canceled');
            requested = requested.filter(f => f.id !== requestedPerson.id);
            location.reload();
        } else {
            console.error(result.error || 'Failed to cancel request');
        }
    } catch (error) {
        console.error('Error during canceling request:', error);
    }
  };

  $: filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(searchTermPeople.toLowerCase())
    );

  $: filteredRequested = requested.filter(person =>
      person.name.toLowerCase().includes(searchTermRequested.toLowerCase())
    );

  import { getDefaultProfilePictureUrl } from './pfp.js';
</script>


<Listgroup active class="w-full md:w-80">
  <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">People</h3>
  <input type="text" bind:value={searchTermPeople} placeholder="Search..." class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
  {#each filteredPeople as person}
    <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
        <a rel="external" href="../profile/{person.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
          <Avatar src={getDefaultProfilePictureUrl(person)} size="xs" style="margin-right: 8px;" />
          <span>{person.name}</span>
        </a>
        <button on:click={() => addFriend(person)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          Add
        </button>
      </ListgroupItem>
  {/each}
</Listgroup>

{#if requested.length > 0}
<Listgroup active class="w-full md:w-80 mt-4">
  <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Requested</h3>
  <input type="text" bind:value={searchTermRequested} placeholder="Search..." class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
  {#each filteredRequested as person}
    <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
        <a rel="external" href="../profile/{person.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
          <Avatar src={getDefaultProfilePictureUrl(person)} size="xs" style="margin-right: 8px;" />
          <span>{person.name}</span>
        </a>
        <button on:click={() => cancelRequest(person)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          Cancel
        </button>
      </ListgroupItem>
  {/each}
</Listgroup>
{/if}

