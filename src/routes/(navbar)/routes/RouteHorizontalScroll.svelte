<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>


<script lang="ts">
    import type {RouteEntry, user} from '$lib/interfaces';
    import { goto } from '$app/navigation';
    import { Button, Input, Select,Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
    import { EyeOutline,EyeSlashOutline, PenOutline } from 'flowbite-svelte-icons';
    import SingleRoute from "$lib/components/SingleRoute.svelte";

    export let user_id: number;
    export let addRouteToGroup: (route:RouteEntry) => void;
    export let routeEntries:RouteEntry[] = [];
    export let nameOfList:string = "";
    export let adminGroupNames:string[] = [];
    export let searchTerm = "";
    export let updateCurrentPage: (value: string) => void;
    export let showGroupOnMap: boolean;
    
    function toggleShowOnMap(route:RouteEntry) {
        const routeIndex = routeEntries.findIndex(r => r.id === route.id);
        routeEntries[routeIndex] = { ...route, showOnMap: !route.showOnMap };
        routeEntries = routeEntries;
        const formData = new FormData();
        formData.append('type', 'toggleShowRouteOnMap');
        formData.append('routeID', route.id.toString());
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', route.showOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                let actualResponse = data.data;
                actualResponse = JSON.parse(actualResponse);
                console.log('actual response', actualResponse);
            });
    }

    function toggleShowGroupOnMap(group: string) {
        const groupName = group;
        const formData = new FormData();
        formData.append('type', 'toggleShowGroupOnMap');
        formData.append('groupName', groupName);
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', showGroupOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData
        });
        showGroupOnMap = !showGroupOnMap;

    }



    const editRoute = (route: RouteEntry) => {
        goto(`../edit_route/${route.id}`);
    }



</script>

<div class="container">
    <button style="display: inline-block;" on:click={() => updateCurrentPage(nameOfList)} role="button">
        <Heading>{nameOfList} </Heading>
        <Secondary>{routeEntries.filter((r) => (r.name.toUpperCase().includes(searchTerm.toUpperCase())) || r.creator.toUpperCase().includes(searchTerm.toUpperCase())).length} routes </Secondary>
    </button>
    {#if !(nameOfList === "Your Routes" || nameOfList === "Public Routes" || nameOfList === "Friends Routes")}
            <Button on:click={() => toggleShowGroupOnMap(nameOfList)}>
                {#if showGroupOnMap}
                    <EyeOutline />
                {:else}
                    <EyeSlashOutline />
                {/if}
            </Button>
        {/if}
    <div class="scrollable-grid">
        {#each routeEntries.slice(0, 12) as route, index}
        {#if (route.name.toUpperCase().includes(searchTerm.toUpperCase()) || route.creator.toUpperCase().includes(searchTerm.toUpperCase())) }
            <div class="grid-item">
                <div style="display: flex; justify-content: space-between;">
                    {#if nameOfList === "Your Routes"}
                        <Button on:click={() => editRoute(route)}><PenOutline /></Button>
                    {/if}
                    <P>{route.name}</P>
                    {#if (nameOfList === "Your Routes" || nameOfList === "Public Routes" || nameOfList === "Friends Routes")}
                    <Button on:click={() => toggleShowOnMap(route)}>
                        {#if route.showOnMap}
                            <EyeOutline />
                        {:else}
                            <EyeSlashOutline />
                        {/if}
                    </Button>
                    {/if}
                </div>
                <P>{route.completionTime} mins</P>
                <P>Uploaded by {route.creator} </P>
                <P>on {route.createdOn.toLocaleDateString()} at {route.createdOn.toLocaleTimeString()} </P>
                <SingleRoute {route} />
                {#if nameOfList === "Your Routes" || route.publicity === 2}
                <div style="display: flex;">
                    <Select bind:value={route.group}>
                        {#each adminGroupNames as group}
                            <option value={group}>{group}</option>
                        {/each}
                    </Select>
                    <Button on:click={() => addRouteToGroup(route)}>Add to group</Button>
                </div>
                {/if}
            </div>
        {/if}
    {/each}
        {#if routeEntries.length > 12}
            <div class="grid-item"><Heading>See all...</Heading></div>
        {/if}
    </div>
</div>

<style>
    .scrollable-grid {
        display: flex;
        overflow-x: auto;
        gap: 10px;
    }
    .grid-item {
        flex: 0 0 auto;
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>