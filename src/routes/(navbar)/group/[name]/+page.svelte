<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<script lang="ts">
    // @ts-nocheck
    export let data;
    export const group = data.group;
    export const members = data.members;
    export const creator = data.creator;
    export const memberCount = data.memberCount;
    export let groupRouteEntries = data.groupRouteEntryObj;
    export const currentUser = data.user;
    export let friends = data.currentUserFriends;
    import SingleRoute from "$lib/components/SingleRoute.svelte";
    import type user from '$lib/interfaces';


    import { Button, Card, Tabs, TabItem, Listgroup, ListgroupItem, Avatar, Heading, List, Li } from 'flowbite-svelte';
        
    function getInitials(fullName) {
        // Split the full name into an array of words
        const nameArray = fullName.split(" ");
        
        // Initialize an empty string to store initials
        let initials = "";

        // Loop through each word in the name array
        nameArray.forEach(word => {
            // Add the first character of each word to the initials string
            initials += word.charAt(0).toUpperCase();
        });

        return initials;
    }

    const getRouteDuration = (route: RouteEntry) => {
        let date = new Date(0);
        date.setSeconds(route.completionTime);
        return date.toISOString().substring(11, 19);
    };

    const deleteRouteFromGroup = (route: RouteEntry) => {
        const formData = new FormData();
        formData.append('type', 'deleteRouteFromGroup');
        formData.append('routeID', route.id.toString());
        formData.append('groupID', group.id.toString());
        const groupUrl = `/group/${encodeURIComponent(group.name)}/`;
        fetch(groupUrl, {
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
                console.error('Error removing route:', error);
            });
    }

    const inviteToGroup = async (friend: user) => {
        const formData = new FormData();
        formData.append('type', 'inviteToGroup');
        formData.append('friendID', friend.id.toString());
        formData.append('groupID', group.id.toString());
        const groupUrl = `/group/${encodeURIComponent(group.name)}/`;
        fetch(groupUrl, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                let actualResponse = data.data;
                actualResponse = JSON.parse(actualResponse);
                //update the groupRouteEntries with the new group
                if (actualResponse[1] == 200) {
                    console.log('Invited friend to group');
                }
                
            })
            .catch((error) => {
                console.error('Error inviting to group:', error);
            });
    }

</script>
 
<style>
    body {
        overflow: hidden; /* Hide scrollbars */
    }    
    
    .main-container {
        height: 80vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

    
    }

    .map-container {
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 15px;
    }


    
</style>

<body>
    <div class="main-container">
        <Card padding="lg" size="lg">
            <div class="flex flex-col items-center pb-4">
                <Avatar size="lg">{getInitials(group.name)}</Avatar>
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{group.name}</h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">This group was created by @{creator.username}.</span>
            </div>
            <Tabs style="full" tabStype="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700">
                <TabItem class="w-full" open>
                    <span slot="title">Members</span>
                    <Listgroup items={members} let:item class="border-0 dark:!bg-transparent">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            {#if item.username == creator.username}
                            <Avatar border class="ring-amber-400 dark:ring-amber-300">{getInitials(item.first_name + " " + item.last_name)}</Avatar>
                            {:else}
                            <Avatar>{getInitials(item.first_name + " " + item.last_name)}</Avatar>
                            {/if}
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {item.first_name} {item.last_name}
                                </p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                    @{item.username}
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <Button color="light" rel="external" href="../profile/{item.username}">View Profile</Button>
                            </div>
                        </div>
                    </Listgroup>
                </TabItem>
                <TabItem class="w-full">
                    <span slot="title">Routes</span>
                    {#if groupRouteEntries.routes.length == 0}
                            <div class="flex items-center space-x-4 rtl:space-x-reverse">Group has no Routes.</div>
                    {:else}
                        <Listgroup items={groupRouteEntries.routes} let:item class="border-0 dark:!bg-transparent">
                            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                <div class="map-container">
                                    <SingleRoute route={item}/>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {item.name}
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        Created by: {item.creator}
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        Date Created: {item.createdOn.toLocaleString()}
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        Route Duration: {getRouteDuration(item)}
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    {#if (currentUser.username === item.creator || currentUser.username === creator.username)}
                                        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <Button color=light on:click={() => deleteRouteFromGroup(item)}>Remove</Button>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </Listgroup>
                    {/if}
                </TabItem>
                {#if currentUser.id === group.creator}
                <TabItem class="w-full" open>
                    <span slot="title">Invites</span>
                    {#if friends.length == 0}
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">No friends to invite</div>
                    {:else}
                        <Listgroup items={friends} let:item class="border-0 dark:!bg-transparent">
                            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                <Avatar>{getInitials(item.first_name + " " + item.last_name)}</Avatar>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {item.first_name} {item.last_name}
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        @{item.username}
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    <Button color=light on:click={() => inviteToGroup(item)}>Invite</Button>
                                </div>
                            </div>   
                        </Listgroup>
                    {/if}
                </TabItem>
                {/if}
            </Tabs>
        </Card>
    </div>
</body>