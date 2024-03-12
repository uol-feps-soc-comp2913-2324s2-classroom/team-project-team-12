<title>Journeys</title>
<script>
  export let data;
  import FriendList from './friendlist.svelte';
  import UnaddedList from './unaddedlist.svelte';
  import Relationship from './relationship.svelte';

  const currentUserFriends = data.currentUserFriends || [];
  const unaddedPeople = data.unaddedPeople || [];
  const users = data.users || [];
</script>

<div class="container">
  <div class="friends-container">
    <input type="text" placeholder="Search Friends">
    <FriendList friends={currentUserFriends} />
  </div>

  <div class="unadded-people-container">
    <input type="text" placeholder="Search People">
    <UnaddedList people={unaddedPeople} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .friends-container,
  .unadded-people-container {
    width: 45%;
    margin: 20px;
    padding: 10px;
    border-radius: 5px;
  }
</style>
