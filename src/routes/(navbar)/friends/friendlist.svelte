<script lang="ts">
  import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
  export let currentUserFriends: { id: number, name: string }[] = [];
  export let searchTerm = "";
  let currentPage = 1;
  const pageSize = 2;

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
          let actualResult = result.data;
          actualResult = JSON.parse(actualResult);
          
          if (actualResult[1] == 200) {
              console.log(result.message || 'Delted friend successfully');
              currentUserFriends = currentUserFriends.filter(f => f.id !== friend.id);
              
          } else {
            console.error(actualResult[3] || 'Failed to delete friend');
        }
      } catch (error) {
          console.error('Error deleting friend:', error);
      }
  };


$: filteredFriends = currentUserFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  $: {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    filteredFriends = currentUserFriends.slice(startIndex, endIndex);
    filteredFriends = filteredFriends.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
 
  import { getDefaultProfilePictureUrl } from './pfp.js';

</script>

<Listgroup active class="w-full md:w-80">
  <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Friends</h3>
  {#each filteredFriends as friend}
    <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
      <a rel="external" href="../profile/{friend.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
        <Avatar src={getDefaultProfilePictureUrl(friend)} size="xs" style="margin-right: 8px;" />
        <span>{friend.name.length > 15 ? `${friend.name.slice(0, 15)}...` : friend.name}</span>
      </a>
      <button on:click={() => deleteFriend(friend)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
        Delete
      </button>
    </ListgroupItem>
  {/each}

  {#if currentUserFriends.length > pageSize}
    <!-- Pagination buttons container with padding -->
    <div class="flex justify-center mt-4 py-2">
      <!-- Previous Page Button -->
      <button
        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
        disabled={currentPage === 1}
        on:click={() => currentPage -= 1}>
        Previous
      </button>
  
      <!-- First Page Button -->
      {#if currentPage != 1}
        <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          on:click={() => currentPage = 1}>
          1
        </button>
      {/if}
  
      <!-- Current Page Button -->
      <button
        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
        disabled>
        {currentPage}
      </button>
  
      <!-- Last Page Button -->
      {#if currentPage < Math.ceil(currentUserFriends.length / pageSize)}
        <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          on:click={() => currentPage = Math.ceil(currentUserFriends.length / pageSize)}>
          {Math.ceil(currentUserFriends.length / pageSize)}
        </button>
      {/if}
  
      <!-- Next Page Button -->
      <button
        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
        disabled={currentPage === Math.ceil(currentUserFriends.length / pageSize)}
        on:click={() => currentPage += 1}>
        Next
      </button>
    </div>
  {/if}
  </Listgroup>