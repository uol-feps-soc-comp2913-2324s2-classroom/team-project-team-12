<script lang="ts">
  import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
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

<Listgroup active class="w-full md:w-80">
  <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Friends</h3>
  <input type="text" bind:value={searchTerm} placeholder="Search friends..." class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
  {#each filteredFriends as friend}
  <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
      <a rel="external" href="../profile/{friend.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
        <Avatar src={getDefaultProfilePictureUrl(friend)} size="xs" />
        <span>{friend.name}</span>
      </a>
      <button on:click={() => deleteFriend(friend)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
        Delete
      </button>
    </ListgroupItem>
  {/each}
</Listgroup>