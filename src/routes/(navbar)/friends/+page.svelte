<title>Journeys</title>
<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  export let data;
  export let friends;
  import FriendList from './friendlist.svelte';
  import UnaddedList from './unaddedlist.svelte';
  import RequestsList from './requests.svelte';

  let currentUserFriends;
  let friendRequests;
  let unaddedPeople;
  let requested;

  onMount(() => {
        // Check if data is invalid and redirect if necessary
        if (data.invalid) {
            goto('/');
        }
  });

  if(data.user){
    friends = data.currentUserFriends || []
    currentUserFriends = data.currentUserFriends || [];
    friendRequests = data.friendRequests || [];
    unaddedPeople = data.unaddedPeople || [];
    requested = data.requested || [];
  }

</script>

<div class="container">
  <div class="friends-container">
    <FriendList {currentUserFriends}/>
  </div>

<div class="requests-container">
    <RequestsList friendRequests={friendRequests} />
  </div>

<div class="unadded-people-container">
    <UnaddedList people={unaddedPeople} requested={requested}/>
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
