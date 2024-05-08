<script lang="ts">
    // @ts-nocheck
    export let data;
    export const user = data.user;
    export const userFriends = data.friends;
    export const userGroups = data.groupsWithMembersCount;
    export const friendCount = data.friendCount;
    export const groupCount = data.groupCount;
    export const isFriend = data.isFriend;
    export const friendRequest = data.friendRequest;
    export const profile = data.logged;
    export const userRoutes = data.userRoutes;
    export const resolvedRoutes = data.resolvedRoutes;
    import type { RouteEntry } from '$lib/interfaces';
    import { Button, Card, Tabs, TabItem, Listgroup, Avatar } from 'flowbite-svelte';

    import { SingleRoute } from '$lib';

    function getInitials(fullName) {
        // Split the full name into an array of words
        const nameArray = fullName.split(' ');

        // Initialize an empty string to store initials
        let initials = '';

        // Loop through each word in the name array
        nameArray.forEach((word) => {
            // Add the first character of each word to the initials string
            initials += word.charAt(0).toUpperCase();
        });

        return initials;
    }

    export let people: { id: number; name: string; first_name: string; last_name: string }[] = [];

    const addFriend = async (person: { id: number; name: string }) => {
        const formData = new FormData();
        formData.append('type', 'addFriend');
        formData.append('id', person.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Friend request sent');
                people = people.filter((f) => f.id !== person.id);
                window.location.reload();
            } else {
                console.error(result.error || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error during sending request:', error);
        }
    };

    const getRouteDuration = (route: RouteEntry) => {
        let date = new Date(0);
        date.setSeconds(route.completionTime);
        return date.toISOString().substring(11, 19);
    };

    export let currentUserFriends: { id: number; name: string }[] = [];

    const deleteFriend = async (friend: { id: number; name: string }) => {
        const formData = new FormData();
        formData.append('type', 'deleteFriend');
        formData.append('id', friend.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Friend deleted successfully');
                currentUserFriends = currentUserFriends.filter((f) => f.id !== friend.id);
                window.location.reload();
            } else {
                console.error(result.error || 'Failed to delete friend');
            }
        } catch (error) {
            console.error('Error during friend deletion:', error);
        }
    };
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div class="card-container">
    <Card padding="lg" size="lg">
        <div class="flex flex-col items-center pb-4">
            <Avatar size="lg">{getInitials(user.first_name + ' ' + user.last_name)}</Avatar>
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">@{user.username}</span>
            <div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
                {#if user.username == profile.username}
                    <Button color="green" href="../../account">My Account</Button>
                {:else if !isFriend && friendRequest == null}
                    <Button color="blue" on:click={() => addFriend(user)}>Request</Button>
                {:else if friendRequest?.friend_request}
                    <Button color="light" on:click={() => deleteFriend(user)}>Requested</Button>
                {:else}
                    <Button color="red" on:click={() => deleteFriend(user)}>Remove</Button>
                {/if}
            </div>
        </div>
        {#if user.default_publicity == 2 || (user.default_publicity == 1 && isFriend) || user.username == profile.username}
            <Tabs
                style="full"
                tabStype="full"
                defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700"
            >
                <TabItem class="w-full" open>
                    <span slot="title">Friends</span>
                    {#if userFriends.length == 0}
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">User has no friends.</div>
                    {:else}
                        <div class="scroll-area">
                            <Listgroup items={userFriends} let:item class="border-0 dark:!bg-transparent">
                                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                    <Avatar>{getInitials(item.first_name + ' ' + item.last_name)}</Avatar>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {item.first_name}
                                            {item.last_name}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            @{item.username}
                                        </p>
                                    </div>
                                    <div
                                        class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                                    >
                                        <Button color="light" rel="external" href="../profile/{item.username}"
                                            >View Profile</Button
                                        >
                                    </div>
                                </div>
                            </Listgroup>
                        </div>
                    {/if}
                </TabItem>
                <TabItem class="w-full">
                    <span slot="title">Groups</span>
                    {#if userGroups.length == 0}
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">User has no groups.</div>
                    {:else}
                        <div class="scroll-area">
                            <Listgroup items={userGroups} let:item class="border-0 dark:!bg-transparent">
                                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                    <Avatar>{getInitials(item.name)}</Avatar>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {item.name}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            Members: {item.memberCount}
                                        </p>
                                    </div>
                                    <div
                                        class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                                    >
                                        <Button color="light" href="../../group/{item.name}">View Group</Button>
                                    </div>
                                </div>
                            </Listgroup>
                        </div>
                    {/if}
                </TabItem>
                <TabItem class="w-full">
                    <span slot="title">Routes</span>
                    {#if resolvedRoutes.length == 0}
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">User has no Routes.</div>
                    {:else}
                        <div class="scroll-area">
                            <Listgroup items={resolvedRoutes} let:item class="border-0 dark:!bg-transparent">
                                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div class="map-container">
                                        <SingleRoute route={item} />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {item.name}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            Date Created: {item.createdOn.toLocaleString()}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            Route Duration: {getRouteDuration(item)}
                                        </p>
                                    </div>
                                </div>
                            </Listgroup>
                        </div>
                    {/if}
                </TabItem>
            </Tabs>
        {:else if user.default_publicity == 0}
            <div class="flex flex-col items-center pb-4">
                <br />
                <span class="text-sm text-gray-500 dark:text-gray-400">This users profile is set to private.</span>
            </div>
        {:else}
            <div class="flex flex-col items-center pb-4">
                <br />
                <span class="text-sm text-gray-500 dark:text-gray-400"
                    >This users profile is set to private, friend this user to view more.</span
                >
            </div>
        {/if}
    </Card>
</div>

<style>
    body {
        height: 100%;
        overflow: scroll;
        padding: 10px;
    }

    .card-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
    }

    .main-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        overflow-y: hidden;
    }

    .map-container {
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 15px;
    }

    .scroll-area {
        height: 300px;
        overflow-y: scroll;
        width: 100%;
        padding-bottom: 10px;
    }
</style>
