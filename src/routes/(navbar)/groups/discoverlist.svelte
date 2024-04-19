<script lang="ts">

    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let notMemberOfGroups: { id: number, name: string }[] = [];
    export let requested: { id: number, user_id: number, group_id: number, groups: { name: string } }[] = [];

    export let searchTerm = "";
    
    const joinGroup = async (group: { id: number, name: string }) => {
      const formData = new FormData();
      formData.append('type', 'joinGroup');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Left group successfully');
              notMemberOfGroups = notMemberOfGroups.filter(g => g.id !== group.id);
              location.reload();
              
          } else {
              console.error(result.error || 'Failed to leave group');
          }
      } catch (error) {
          console.error('Error leaving group:', error);
      }
  };
  
  const cancelGroupRequest = async (group: { id: number, user_id: number, group_id: number, groups: { name: string } }) => {
      const formData = new FormData();
      formData.append('type', 'cancelRequest');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Cancel group request successfully');
              notMemberOfGroups = notMemberOfGroups.filter(g => g.id !== group.id);
              location.reload();
              
          } else {
              console.error(result.error || 'Failed to cancel group request');
          }
      } catch (error) {
          console.error('Error leaving group:', error);
      }
  };

  
  
  $: filteredGroups = notMemberOfGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  $: filteredRequested = requested.filter(group =>
      group.groups.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
   
  
  </script>
  
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">People</h3>
    {#each filteredGroups as group}
      <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
          <a rel="external" href="../group/{group.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.name}</span>
          </a>
          <button on:click={() => joinGroup(group)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Join
          </button>
        </ListgroupItem>
    {/each}
  </Listgroup>
  
  {#if requested.length > 0}
  <Listgroup active class="w-full md:w-80 mt-4">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Requested</h3>
    {#each filteredRequested as group}
      <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
          <a rel="external" href="../group/{group.groups.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.groups.name}</span>
          </a>
          <button on:click={() => cancelGroupRequest(group)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Cancel
          </button>
        </ListgroupItem>
    {/each}
  </Listgroup>
  {/if}