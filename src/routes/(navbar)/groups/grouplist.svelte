<script lang="ts">
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let memberOfGroups: { id: number, name: string }[] = [];

    let searchTerm = "";
    
    const leaveGroup = async (group: { id: number, name: string }) => {
      const formData = new FormData();
      formData.append('type', 'leaveGroup');
      formData.append('id', group.id.toString());
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Friend deleted successfully');
              memberOfGroups = memberOfGroups.filter(g => g.id !== group.id);
              location.reload();
              
          } else {
              console.error(result.error || 'Failed to delete friend');
          }
      } catch (error) {
          console.error('Error during friend deletion:', error);
      }
  };
  
  
  $: filteredGroups = memberOfGroups.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
   
  
  </script>
  
  <Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Groups</h3>
    <input type="text" bind:value={searchTerm} placeholder="Search..." class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
    {#each filteredGroups as group}
      <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
          <a rel="external" href="../profile/{group.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.name}</span>
          </a>
          <button on:click={() => leaveGroup(group)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Leave
          </button>
        </ListgroupItem>
    {/each}
  </Listgroup>