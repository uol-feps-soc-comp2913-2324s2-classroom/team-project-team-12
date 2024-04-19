<script lang="ts">
  import { Dropdown, DropdownItem  } from 'flowbite-svelte';
  import { PlusOutline } from 'flowbite-svelte-icons'

  let isDropdownOpen = false;
  let groupName = ''; // Store the group name

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
    if (!isDropdownOpen) {
      // Reset group name when dropdown is closed
      groupName = '';
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() !== '') {
            const formData = new FormData();
      formData.append('type', 'createGroup');
      formData.append('groupName', groupName);
  
      try {
          const response = await fetch('/groups', {
              method: 'POST',
              body: formData,
          });
  
          const result = await response.json();
  
          if (response.ok) {
              console.log(result.message || 'Created group successfully');
              toggleDropdown(); // Close the dropdown after creating the group
              location.reload();
              
          } else {
              console.error(result.error || 'Failed to create group');
          }
      } catch (error) {
          console.error('Error creating group:', error);
      }
    }
  };
</script>

<div class="relative">
  <button
    class="flex items-center justify-center w-10 h-10 dark:text-white bg-gray-100 dark:bg-gray-900 rounded-full hover:text-gray-900 hover:bg-gray-200 focus:outline-none"
    on:click={toggleDropdown}
  >
    <PlusOutline class="w-6 h-6" />
  </button>

  <Dropdown bind:isOpen={isDropdownOpen} class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-700">
    <div class="px-4 py-2">
    </div>
    <DropdownItem on:click={handleCreateGroup} class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white cursor-pointer">
      Create Group
    </DropdownItem>
  </Dropdown>
</div>
