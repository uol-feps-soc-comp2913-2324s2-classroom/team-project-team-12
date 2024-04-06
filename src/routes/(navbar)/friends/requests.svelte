<script lang="ts">

  let searchTerm = "";
  export let friendRequests: { id: number, name: string }[] = [];
  import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
  
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

        if (response.ok) {
            console.log(result.message || 'Friend accepted successfully');
            friendRequests = friendRequests.filter(f => f.id !== request.id);
            location.reload();
        } else {
            console.error(result.error || 'Failed to accept friend');
        }
    } catch (error) {
        console.error('Error during friend acception:', error);
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
  
          if (response.ok) {
              console.log(result.message || 'Friend accepted successfully');
              friendRequests = friendRequests.filter(f => f.id !== request.id);
              location.reload();
          } else {
              console.error(result.error || 'Failed to accept friend');
          }
      } catch (error) {
          console.error('Error during friend acception:', error);
      }
  };

  $: filteredRequests = friendRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  import { getDefaultProfilePictureUrl } from './pfp.js';

  </script>
  
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Friend Requests</h3>
    <input type="text" bind:value={searchTerm} placeholder="Search..." class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
    {#each filteredRequests as request}
    <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
        <a rel="external" href="../profile/{request.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
          <Avatar src={getDefaultProfilePictureUrl(request)} size="xs" />
          <span>{request.name}</span>
        </a>
        <button on:click={() => acceptFriend(request)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          Accept
        </button>
        <button on:click={() => declineFriend(request)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
          Decline
        </button>
      </ListgroupItem>
    {/each}
  </Listgroup>