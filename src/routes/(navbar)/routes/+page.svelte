
<script lang="ts">
import { onMount } from 'svelte';
import  SingleRoute from "$lib/components/SingleRoute.svelte"
import { Button, Input, Select,Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
export let data;
import type { GroupedRouteEntry, RouteEntry } from '$lib/interfaces';
import RouteHorizontalScroll from './RouteHorizontalScroll.svelte';
import RouteGridPage from './RouteGridPage.svelte';

let userRouteEntries = data.props.userRouteEntries;
let friendsRouteEntries = data.props.friendsRouteEntries;
let groupsRouteEntries = data.props.groupRouteEntries;
let publicRouteEntries = data.props.publicRouteEntries;

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

//convert friendsRouteEntries to GroupedRouteEntry
let groupedFriendsRouteEntries: GroupedRouteEntry[] = [];
friendsRouteEntries.forEach(route => {
    let groupedRoute = {
        name: route.name,
        creator: route.creator,
        createdOn: route.createdOn,
        completionTime: route.completionTime,
        path: route.path,
        group: null
    }
    groupedFriendsRouteEntries.push(groupedRoute);
});

//convert groupsRouteEntries to GroupedRouteEntry
let groupedGroupsRouteEntries: GroupedRouteEntry[] = [];
groupsRouteEntries.forEach(route => {
    let groupedRoute = {
        name: route.name,
        creator: route.creator,
        createdOn: route.createdOn,
        completionTime: route.completionTime,
        path: route.path,
        group: null
    }
    groupedGroupsRouteEntries.push(groupedRoute);
});

//convert publicRouteEntries to GroupedRouteEntry
let groupedPublicRouteEntries: GroupedRouteEntry[] = [];
publicRouteEntries.forEach(route => {
    let groupedRoute = {
        name: route.name,
        creator: route.creator,
        createdOn: route.createdOn,
        completionTime: route.completionTime,
        path: route.path,
        group: null
    }
    groupedPublicRouteEntries.push(groupedRoute);
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
    fetch('/routes', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


    
    let searchTerm:string = "";
    let currentPage = 0;
    const updateCurrentPage = (value: number) => {
        console.log('updating current page to ', value);
        currentPage = value;
    };

</script>

{#if currentPage == 0}
<Input type="text" bind:value={searchTerm} placeholder="Search routes..." />
<RouteHorizontalScroll nameOfList="Your Routes" routeEntries={groupedUserRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} {updateCurrentPage}/>
<RouteHorizontalScroll nameOfList="Friends Routes" routeEntries={groupedFriendsRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} {updateCurrentPage} />
<RouteHorizontalScroll nameOfList="Groups Routes" routeEntries={groupedGroupsRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} {updateCurrentPage}/>
<RouteHorizontalScroll nameOfList="Public Routes" routeEntries={groupedPublicRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} {updateCurrentPage}/>
{/if}

{#if currentPage == 1}
    <RouteGridPage nameOfList="Your Routes" routeEntries={groupedUserRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} />
{/if}


