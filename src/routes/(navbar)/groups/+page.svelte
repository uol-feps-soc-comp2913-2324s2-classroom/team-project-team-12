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
    const currentUsersFriends = data.currentUserFriends;
    const invitedGroups = data.invitedWithCreator;
    let createToggle = false;
    let searchTerm = '';
</script>

<title>Journeys</title>

<Input bind:value={searchTerm} placeholder="Search groups" on:input={() => {}} />

<div class="bigbox">
    {#if currentUsersFriends.length > 0}
        <div class="add-groups-container">
            <AddGroups {currentUsersFriends} />
        </div>
    {/if}
    {#if memberOfGroups.length > 0}
        <div class="groups-container">
            <Grouplist {memberOfGroups} {searchTerm} />
        </div>
    {/if}
    {#if groupRequests.length > 0 || invitedGroups.length > 0}
        <div class="requests-container">
            <Requestlist {groupRequests} groupInvites={invitedGroups} {searchTerm} />
        </div>
    {/if}
    {#if notMemberOfGroups.length > 0 || requested.length > 0}
        <div class="discover-groups-container">
            <Discoverlist {notMemberOfGroups} {requested} {searchTerm} />
        </div>
    {/if}
</div>

<style>
    .bigbox {
        width: 100%;
        display: flex;
        height: fit-content;
        flex-direction: row;
        padding: 50px;
        justify-content: space-between;
    }

    .groups-container,
    .requests-container,
    .discover-groups-container {
        width: 30%;
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
