
<script lang="ts">
import { onMount } from 'svelte';
import  SingleRoute from "$lib/components/SingleRoute.svelte"
import { Button, Input, Select,Heading, P, A, Mark, Secondary, Alert } from 'flowbite-svelte';
export let data;
import type { RouteEntry,groupRouteEntry} from '$lib/interfaces';
import RouteHorizontalScroll from './RouteHorizontalScroll.svelte';
import RouteGridPage from './RouteGridPage.svelte';


let userRouteEntries: RouteEntry[] = [];
userRouteEntries = data.props.userRouteEntries;
let friendsRouteEntries: RouteEntry[] = [];
friendsRouteEntries = data.props.friendsRouteEntries;
let groupRouteEntries: groupRouteEntry[] = [];
groupRouteEntries = data.props.groupRouteEntries;
let publicRouteEntries: RouteEntry[] = [];
publicRouteEntries = data.props.publicRouteEntries;

$: userRouteEntries = data.props.userRouteEntries;
$: friendsRouteEntries = data.props.friendsRouteEntries;
$: groupRouteEntries = data.props.groupRouteEntries;
$: publicRouteEntries = data.props.publicRouteEntries;

let adminGroups = data.props.adminGroups;
let adminGroupNames = adminGroups.map(group => group.name);
let userData = data.props.user;

console.log('admin groups', adminGroupNames);




const addRouteToGroup = (route: RouteEntry) => {
    console.log('adding ', route.name, 'to group ', route.group);
    const formData = new FormData();
    formData.append('type', 'addRouteToGroup');
    formData.append('routeID', route.id.toString());
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
            let actualResponse = data.data;
            actualResponse = JSON.parse(actualResponse);
            //update the groupRouteEntries with the new group
            if (actualResponse[1] == 200) {
                alertStatus = 2;
                let newGroupRouteEntries = groupRouteEntries.map(groupRouteEntry => {
                if (groupRouteEntry.group_name == route.group) {
                        groupRouteEntry.routes.push(route);
                        alertStatus = 1;
                }
                return groupRouteEntry;
            });
            groupRouteEntries = newGroupRouteEntries;
            }
            
        })
        .catch((error) => {
           
        });
}


    
    let searchTerm:string = "";
    let currentPage = 0;
    let pageDict = {
        "Main": 0,
        "Your Routes": 1,
        "Friends Routes": 2,
        "Public Routes": 3,
    }
    //add the group names to the pageDict
    groupRouteEntries.forEach(groupRouteEntry => {
        pageDict[groupRouteEntry.group_name as keyof typeof pageDict] = 4 + groupRouteEntries.indexOf(groupRouteEntry);
    });
    const updateCurrentPage = (value: string) => {
        currentPage = pageDict[value as keyof typeof pageDict];
        //console.log('updating current page to ', value);
    };

    let alertStatus = 0;

    const closeAlert = () => {
     alertStatus = 0;
    };
</script>
{#if userData}
    
    {#if alertStatus == 1}
        <Alert type="success" dismissable on:close={closeAlert}>
            <P>Route added to group successfully!</P>
        </Alert>
    {/if}
    {#if alertStatus == 2}
        <Alert type="danger" dismissable on:close={closeAlert}>
            <P>Failed to add route to group!</P>
        </Alert>
    {/if}
    {#if currentPage == 0}
    <Input type="text" bind:value={searchTerm} placeholder="Search routes..." />
    <RouteHorizontalScroll user_id={userData.id} nameOfList="Your Routes" routeEntries={userRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} showGroupOnMap={false} {updateCurrentPage}/>
    <RouteHorizontalScroll user_id={userData.id} nameOfList="Friends Routes" routeEntries={friendsRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} showGroupOnMap={false} {updateCurrentPage} />
    <RouteHorizontalScroll user_id={userData.id} nameOfList="Public Routes" routeEntries={publicRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} searchTerm={searchTerm} showGroupOnMap={false} {updateCurrentPage}/>
    {#each groupRouteEntries as groupRouteEntry (groupRouteEntry)}
            {#if groupRouteEntry.routes && groupRouteEntry.routes.length > 0}
                <RouteHorizontalScroll 
                    user_id={userData.id}
                    nameOfList={groupRouteEntry.group_name} 
                    routeEntries={groupRouteEntry.routes} 
                    adminGroupNames={adminGroupNames} 
                    addRouteToGroup={addRouteToGroup} 
                    searchTerm={searchTerm}
                    showGroupOnMap={groupRouteEntry.showOnMap}
                    {updateCurrentPage} 
                />
            {/if}
        {/each}
    {/if}
    {#if currentPage == 1}
        <RouteGridPage nameOfList="Your Routes" routeEntries={userRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} {updateCurrentPage}/>
    {/if}
    {#if currentPage == 2}
        <RouteGridPage nameOfList="Friends Routes" routeEntries={friendsRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} {updateCurrentPage}/>
    {/if}
    {#if currentPage == 3}
        <RouteGridPage nameOfList="Public Routes" routeEntries={publicRouteEntries} adminGroupNames={adminGroupNames} addRouteToGroup={addRouteToGroup} {updateCurrentPage}/>
    {/if}
    {#each groupRouteEntries as groupRouteEntry (groupRouteEntry)}
        {#if currentPage == 4 + groupRouteEntries.indexOf(groupRouteEntry)}
            <RouteGridPage 
                nameOfList={groupRouteEntry.group_name} 
                routeEntries={groupRouteEntry.routes} 
                adminGroupNames={adminGroupNames} 
                addRouteToGroup={addRouteToGroup} 
                {updateCurrentPage} 
            />
        {/if}
    {/each}

{/if}



