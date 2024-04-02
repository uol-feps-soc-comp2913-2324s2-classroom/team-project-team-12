<script lang="ts">
import { onMount } from 'svelte';
import  SingleRoute from "$lib/components/SingleRoute.svelte"
import { Button, Input, Select } from 'flowbite-svelte';
export let data;
import type { GroupedRouteEntry, RouteEntry } from '$lib/interfaces';
let userCurrentPage = 1;
let itemsPerPage = 6;


let userRouteEntries = data.props.userRouteEntries;
let adminGroups = data.props.adminGroups;
let adminGroupNames = adminGroups.map(group => group.name);
let userData = data.props.user;

console.log('admin groups', adminGroupNames);

onMount(() => {
    console.log('user groups with admin perms', adminGroups);
    console.log('admin group names', adminGroupNames);
});

//convert userRouteEntrys to GroupedRouteEntry
let groupedUserRouteEntries: GroupedRouteEntry[] = [];
userRouteEntries.forEach(route => {
    let groupedRoute = {
        name: route.name,
        creator: route.creator,
        createdOn: route.createdOn,
        completionTime: route.completionTime,
        path: route.path,
        group: null
    }
    groupedUserRouteEntries.push(groupedRoute);
});



const addRouteToGroup = (route: GroupedRouteEntry) => {
    console.log('adding ', route.name, 'to group ', route.group);
    const formData = new FormData();
    formData.append('type', 'addRouteToGroup');
    formData.append('routeName', route.name);
    formData.append('creator', route.creator);
    formData.append('username', userData.username);
    formData.append('userID', userData.id.toString());
    if (route.group) formData.append('groupName', route.group);
    fetch('/admin', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

let searchTerm = '';
</script>
<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div class="container">
    <h1>Your Routes</h1>
    <Input type="text" bind:value={searchTerm} placeholder="Search routes..." />
    <div class="grid">
        {#each groupedUserRouteEntries.slice((userCurrentPage - 1) * itemsPerPage, userCurrentPage * itemsPerPage) as route}
            {#if (route.name.toUpperCase().includes(searchTerm.toUpperCase()) || route.creator.toUpperCase().includes(searchTerm.toUpperCase())) }
                <div class="grid-item">
                    {route.name} <br>
                    {route.completionTime} <br>
                    Uploaded by {route.creator} <br>
                    on {route.createdOn.toLocaleDateString()} at {route.createdOn.toLocaleTimeString()} <br>
                    <SingleRoute {route} />
                    <div style="display: flex;">
                        <Select bind:value={route.group}>
                              {#each adminGroupNames as group}
                                <option value={group}>{group}</option>
                            {/each}
                        </Select>
                        <Button on:click={() => addRouteToGroup(route)}>Add to group</Button>
                    </div>
            </div>
            {/if}
        {/each}
    </div>

    <Button  on:click={() => userCurrentPage > 1 && userCurrentPage--} disabled={userCurrentPage===1}>Previous</Button>
    <Button on:click={() =>  userCurrentPage++} disabled={(userCurrentPage + 1) * itemsPerPage >= userRouteEntries.length}>Next</Button>

</div>


<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 10px;
    }
    .grid-item {
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>