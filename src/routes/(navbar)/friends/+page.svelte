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
  import { Input } from 'flowbite-svelte';

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

  let searchTerm = "";

</script>

<Input
  bind:value={searchTerm}
  placeholder="Search..."
  on:input={() => {
  }} />

<div class="page-container">
  {#if currentUserFriends.length > 0}
  <div class="friends-container">
    <FriendList {currentUserFriends} searchTerm={searchTerm}/>
  </div>
{/if}
{#if friendRequests.length > 0}
  <div class="requests-container">
    <RequestsList {friendRequests} searchTerm={searchTerm}/>
  </div>
{/if}
{#if unaddedPeople.length > 0 || requested.length > 0}
  <div class="unadded-people-container">
    <UnaddedList people={unaddedPeople} requested={requested} searchTerm={searchTerm}/>
  </div>
{/if}
</div>

<style>
  .page-container {
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
