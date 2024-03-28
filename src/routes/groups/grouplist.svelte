<script lang="ts">

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
  
  <style>
    ul {
      list-style: none;
      padding: 0;
    }
  
    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .profile-pic {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ccc;
      margin-right: 10px;
    }
  
    .leave-button {
      margin-left: 10px;
      padding: 5px 10px;
      background-color: #000a0641;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
  </style>
  
  <div>
    <input type="text" placeholder="Current Groups" bind:value={searchTerm} />
    <ul>
      {#each filteredGroups as group}
        <li>
          <span>{group.name}</span>
          <button on:click={() => leaveGroup(group)} class="leave-button">Leave</button>
        </li>
      {/each}
    </ul>
  </div>