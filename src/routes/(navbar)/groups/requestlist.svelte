<script lang="ts">
    import { page } from '$app/stores';
import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let groupRequests: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }[] = [];
    export let groupInvites: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }[] = [];

    export let searchTerm = "";
    let requestCurrentPage = 1;
    let inviteCurrentPage = 1;
    const pageSize = 5;
    
    const acceptRequest = async ( group: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} } ) => {
      const formData = new FormData();
      formData.append('type', 'acceptRequest');
      formData.append('id', group.id.toString());

      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
          let actualResult = result.data;
          actualResult = JSON.parse(actualResult);
          
          if (actualResult[1] == 200) {
              console.log(result.message || 'Group request accepted');
              groupRequests = groupRequests.filter(r => r.id !== group.id);
              groupInvites = groupInvites.filter(r => r.id !== group.id);
              
          } else {
            console.error(actualResult[3] || 'Failed to accept request');
          }
      } catch (error) {
          console.error('Error when accepting request:', error);
      }
  };

  const declineRequest = async ( group: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }) => {
      const formData = new FormData();
      formData.append('type', 'declineRequest');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Friend accepted successfully');
              groupRequests = groupRequests.filter(f => f.id !== group.id);
              groupInvites = groupInvites.filter(r => r.id !== group.id);

          } else {
              console.error(result.error || 'Failed to accept friend');
          }
      } catch (error) {
          console.error('Error during friend acception:', error);
      }
  };

  
  
  
  $: filteredGroups = groupRequests.filter(request =>
      request.users.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  $: filteredInvites = groupInvites.filter(request =>
      request.groups.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
   
  $: {
    const requestStartIndex = (requestCurrentPage - 1) * pageSize;
    const requestEndIndex = requestCurrentPage * pageSize;
    filteredGroups = groupRequests.slice(requestStartIndex, requestEndIndex);
  }

  $: {
    const inviteStartIndex = (inviteCurrentPage - 1) * pageSize;
    const inviteEndIndex = inviteCurrentPage * pageSize;
    filteredInvites = groupInvites.slice(inviteStartIndex, inviteEndIndex);
  }
  
  </script>
  
  {#if groupRequests.length > 0 || groupInvites.length > 0}
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Your Group Requests</h3>
    {#each filteredGroups as group}
      <ListgroupItem class="flex flex-col md:flex-row items-start md:items-center justify-between text-base font-semibold gap-2">
        <div>
          <a rel="external" href="../group/{group.users.username}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.users.username.length > 15 ? `${group.users.username.slice(0, 15)}...` : group.users.username}</span>
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Group: {group.groups.name.length > 15 ? `${group.groups.name.slice(0, 15)}...` : group.groups.name}</p>
          
        </div>
        <div class="flex gap-2">
          <button on:click={() => acceptRequest(group)} class="flex items-center p-1 text-sm font-medium text-green-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-green-500 hover:underline rounded-b-lg">
            Accept
          </button>
          <button on:click={() => declineRequest(group)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Decline
          </button>
        </div>
      </ListgroupItem>
    {/each}
    
    {#each filteredInvites as invite}
      <ListgroupItem class="flex flex-col md:flex-row items-start md:items-center justify-between text-base font-semibold gap-2">
        <div>
          <a rel="external" href="../group/{invite.groups.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{invite.groups.name.length > 15 ? `${invite.groups.name.slice(0, 15)}...` : invite.groups.name}</span>
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">From: {invite.groups.creator.length > 15 ? `${invite.groups.creator.slice(0, 15)}...` : invite.groups.creator}</p>
          
        </div>
        <div class="flex gap-2">
          <button on:click={() => acceptRequest(invite)} class="flex items-center p-1 text-sm font-medium text-green-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-green-500 hover:underline rounded-b-lg">
            Join
          </button>
          <button on:click={() => declineRequest(invite)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Decline
          </button>
        </div>
      </ListgroupItem>
    {/each}

    {#if groupRequests.length > 0}
    {#if groupRequests.length > pageSize}
    <!-- Pagination for Group Requests -->
    <div class="flex justify-center mt-4 py-2">
      <!-- Previous Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          disabled={requestCurrentPage === 1}
          on:click={() => requestCurrentPage -= 1}>
          Previous
      </button>

      <!-- Current Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
          disabled>
          {requestCurrentPage}
      </button>

      <!-- Next Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          disabled={filteredGroups.length < pageSize}
          on:click={() => requestCurrentPage += 1}>
          Next
      </button>
  </div>
  {/if}
  {/if}
   
  {#if groupInvites.length > 0}
  {#if groupInvites.length > pageSize}
  <!-- Pagination for Group Invites -->
  <div class="flex justify-center mt-4 py-2">
      <!-- Previous Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          disabled={inviteCurrentPage === 1}
          on:click={() => inviteCurrentPage -= 1}>
          Previous
      </button>

      <!-- Current Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
          disabled>
          {inviteCurrentPage}
      </button>

      <!-- Next Page Button -->
      <button
          class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
          disabled={filteredInvites.length < pageSize}
          on:click={() => inviteCurrentPage += 1}>
          Next
      </button>
  </div>
  {/if}
  {/if}
    
  </Listgroup>
{/if}




