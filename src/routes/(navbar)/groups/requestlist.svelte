<script lang="ts">
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let groupRequests: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }[] = [];
    export let groupInvites: { id: number, user_id: number, group_id: number, groups: { name: string }, users: { username: string} }[] = [];
    export let searchTerm = "";
    
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
              location.reload();
              
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
              location.reload();
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
   
  
  </script>
  
  {#if groupRequests.length > 0 || groupInvites.length > 0}
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Your Group Requests</h3>
    {#each filteredGroups as group}
      <ListgroupItem class="flex flex-col md:flex-row items-start md:items-center justify-between text-base font-semibold gap-2">
        <div>
          <a rel="external" href="../group/{group.users.username}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.users.username}</span>
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Group: {group.groups.name}</p>
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
            <span>{invite.groups.name}</span>
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">From: {invite.groups.name}</p>
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
    
  </Listgroup>
{/if}




