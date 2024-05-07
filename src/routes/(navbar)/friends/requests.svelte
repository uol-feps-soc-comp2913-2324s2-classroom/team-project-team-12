<script lang="ts">

  export let searchTerm = "";
  export let friendRequests: { id: number, name: string }[] = [];
  import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
  let currentPage = 1;
  const pageSize = 5;
  
  const acceptFriend = async (request: { id: number, name: string }) => {
    const formData = new FormData();
    formData.append('type', 'acceptFriend');
    formData.append('id', request.id.toString());

    try {
        const response = await fetch('/friends', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
          let actualResult = result.data;
          actualResult = JSON.parse(actualResult);
          
          if (actualResult[1] == 200) {
              console.log(result.message || 'Accepted friend request');
              friendRequests = friendRequests.filter(r => r.id !== request.id);
              
          } else {
            console.error(actualResult[3] || 'Failed to accept friend request');
        }
      } catch (error) {
          console.error('Error accepting friend request:', error);
      }
  };

  const declineFriend = async (request: { id: number, name: string }) => {
      const formData = new FormData();
      formData.append('type', 'declineFriend');
      formData.append('id', request.id.toString());
  
      try {
          const response = await fetch('/friends', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
          let actualResult = result.data;
          actualResult = JSON.parse(actualResult);
          
          if (actualResult[1] == 200) {
              console.log(result.message || 'Declined friend request');
              friendRequests = friendRequests.filter(r => r.id !== request.id);
              
          } else {
            console.error(actualResult[3] || 'Failed to decline friend request');
        }
      } catch (error) {
          console.error('Error declining friend request:', error);
      }
  };

  $: filteredRequests = friendRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  $: {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    filteredRequests = friendRequests.slice(startIndex, endIndex);
    filteredRequests = filteredRequests.filter(request =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  import { getDefaultProfilePictureUrl } from './pfp.js';

  </script>
  
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Friend Requests</h3>
    {#each filteredRequests as request}
    <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
        <a rel="external" href="../profile/{request.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
          <Avatar src={getDefaultProfilePictureUrl(request)} size="xs" style="margin-right: 8px;" />
          <span>{request.name.length > 15 ? `${request.name.slice(0, 15)}...` : request.name}</span>
        </a>
        <button on:click={() => acceptFriend(request)} class="flex items-center p-1 text-sm font-medium text-green-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-green-500 hover:underline rounded-b-lg">
          Accept
        </button>
        <button on:click={() => declineFriend(request)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          Decline
        </button>
      </ListgroupItem>
    {/each}

    {#if friendRequests.length > pageSize}
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
      {#if currentPage < Math.ceil(friendRequests.length / pageSize)}
        <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          on:click={() => currentPage = Math.ceil(friendRequests.length / pageSize)}>
          {Math.ceil(friendRequests.length / pageSize)}
        </button>
      {/if}
  
      <!-- Next Page Button -->
      <button
        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
        disabled={currentPage === Math.ceil(friendRequests.length / pageSize)}
        on:click={() => currentPage += 1}>
        Next
      </button>
    </div>
  {/if}
  </Listgroup>