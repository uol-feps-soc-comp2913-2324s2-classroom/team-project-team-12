<script lang="ts">
  import { Dropdown, DropdownItem } from 'flowbite-svelte';
  import { PlusOutline } from 'flowbite-svelte-icons';
  import type { user } from '$lib/interfaces';

  export let currentUsersFriends: user[];

  let isDropdownOpen = false;
  let groupName = ''; // Store the group name
  let selectedFriends: user[] = []; // Store selected friends

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
    if (!isDropdownOpen) {
      // Reset group name and selected friends when dropdown is closed
      groupName = '';
      selectedFriends = [];
    }
  };

  const handleFriendClick = (friend: user) => {
    // Toggle friend selection
    if (selectedFriends.includes(friend)) {
      selectedFriends = selectedFriends.filter(f => f !== friend);
    } else {
      selectedFriends = [...selectedFriends, friend];
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() !== '') {
      const formData = new FormData();
      formData.append('type', 'createGroup');
      formData.append('groupName', groupName);
      
      // Append selected friend IDs to form data
      selectedFriends.forEach(friend => {
        formData.append('friendIds[]', friend.id.toString());
      });

      try {
        const response = await fetch('/groups', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        let actualResult = JSON.parse(result.data);
        
        if (actualResult[1] == 200) {
          console.log(result.message || 'Created group successfully');
          toggleDropdown(); // Close the dropdown after creating the group
          location.reload();
        } else {
          console.error(actualResult[3] || 'Failed to create group');
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
      <input type="text" bind:value={groupName} placeholder="Enter group name" class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
    </div>
    {#if currentUsersFriends.length > 0}
      {#each currentUsersFriends as friend}
        <DropdownItem
          on:click={() => handleFriendClick(friend)}
          class="{selectedFriends.includes(friend) ? 'bg-gray-200' : ''} px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white cursor-pointer"
        >
          {friend.username}
        </DropdownItem>
      {/each}
    {:else}
      <p class="px-4 py-2 text-sm text-gray-600 dark:text-white">No friends available</p>
    {/if}
    <DropdownItem on:click={handleCreateGroup} class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white cursor-pointer">
      Create Group
    </DropdownItem>
  </Dropdown>
</div>
