<title>Journeys</title>
<script>
  export let data;
  export const friends = data.currentUserFriends || [];
  import FriendList from './friendlist.svelte';
  import UnaddedList from './unaddedlist.svelte';
  import RequestsList from './requests.svelte';

  const currentUserFriends = data.currentUserFriends || [];
  const friendRequests = data.friendRequests || [];
  const unaddedPeople = data.unaddedPeople || [];

</script>

<div class="container">
  <div class="friends-container">
    <FriendList {currentUserFriends}/>
  </div>

<div class="requests-container">
    <RequestsList friendRequests={friendRequests} />
  </div>

<div class="unadded-people-container">
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
  .requests-container,
  .unadded-people-container {
    width: 45%;
    margin: 20px;
    padding: 10px;
    border-radius: 5px;
  }
</style>
