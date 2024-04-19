<title>Journeys</title>
<script>

  export let data;
  import Grouplist from './grouplist.svelte';
  import Discoverlist from './discoverlist.svelte';
  import Requestlist from './requestlist.svelte';
  import AddGroups from './addGroup.svelte';
  import { Input } from 'flowbite-svelte';

  const memberOfGroups = data.currentUserGroups;
  const notMemberOfGroups = data.notMemberOfGroups;
  const groupRequests = data.groupRequests;
  const requested = data.requested;

  let searchTerm = "";

</script>

<Input
  bind:value={searchTerm}
  placeholder="Search groups"
  on:input={() => {
    console.log(searchTerm);
  }} />

<div class="container">
  <div class="groups-container">
    <Grouplist {memberOfGroups} searchTerm={searchTerm}/>
  </div>

<div class="requests-container">
    <Requestlist {groupRequests} searchTerm={searchTerm}/>
  </div>

<div class="discover-groups-container">
    <Discoverlist notMemberOfGroups={notMemberOfGroups} requested={requested} searchTerm={searchTerm}/>
  </div>

  <div class="add-groups-container">
    <AddGroups/>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .groups-container,
  .requests-container,
  .discover-groups-container {
    width: 45%;
    margin: 20px;
    padding: 10px;
    border-radius: 5px;
  }
  .add-groups-container {
    position: relative;
    margin: 20px;
    padding: 10px;
  }
</style>
