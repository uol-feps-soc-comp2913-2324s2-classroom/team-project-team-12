<script lang="ts">
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let memberOfGroups: { id: number, name: string }[] = [];

    export let searchTerm = "";
    
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
          let actualResult = result.data;
          actualResult = JSON.parse(actualResult);
          
          if (actualResult[1] == 200) {
              console.log('Friend deleted successfully');
              memberOfGroups = memberOfGroups.filter(g => g.id !== group.id);
              location.reload();
              
          } else {
            console.error(actualResult[3] || 'Failed to delete friend');
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
    {#each filteredGroups as group}
      <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
          <a rel="external" href="../group/{group.name}" class="flex items-center font-semibold text-gray-900 dark:text-white">
            <span>{group.name}</span>
          </a>
          <button on:click={() => leaveGroup(group)} class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
            Leave
          </button>
        </ListgroupItem>
    {/each}
  </Listgroup>