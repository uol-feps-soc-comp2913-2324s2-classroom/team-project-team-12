<title>Journeys</title>
<script>
  export let data;
  import Grouplist from './grouplist.svelte';
  import Discoverlist from './discoverlist.svelte';
  import Requestlist from './requestlist.svelte';
  

  const memberOfGroups = data.currentUserGroups;
  const notMemberOfGroups = data.notMemberOfGroups;
  const groupRequests = data.groupRequests;



</script>

<div class="container">
  <div class="groups-container">
    <Grouplist {memberOfGroups}/>
  </div>

<div class="requests-container">
    <Requestlist {groupRequests} />
  </div>

<div class="discover-groups-container">
    <Discoverlist {notMemberOfGroups}/>
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
</style>
