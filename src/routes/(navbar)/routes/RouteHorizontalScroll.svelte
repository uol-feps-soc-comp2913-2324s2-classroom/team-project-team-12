<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>


<script lang="ts">
    import type {RouteEntry} from '$lib/interfaces';
    import { Button, Input, Select,Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
    import SingleRoute from "$lib/components/SingleRoute.svelte";
    import { on } from 'ramda';
    export let addRouteToGroup: (route:RouteEntry) => void;
    export let routeEntries:RouteEntry[] = [];
    export let nameOfList:string = "";
    export let adminGroupNames:string[] = [];
    export let searchTerm = "";
    export let updateCurrentPage: (value: string) => void;
</script>

<div class="container">
    <button style="display: inline-block;" on:click={() => updateCurrentPage(nameOfList)} role="button">
        <Heading>{nameOfList} </Heading>
        <Secondary>{routeEntries.length} routes </Secondary>
    </button>
    <div class="scrollable-grid">
        {#each routeEntries.slice(0, 12) as route, index}
            {#if (route.name.toUpperCase().includes(searchTerm.toUpperCase()) || route.creator.toUpperCase().includes(searchTerm.toUpperCase())) }
                <div class="grid-item">
                    <P>{route.name}</P>
                    <P>{route.completionTime}</P>
                    <P>Uploaded by {route.creator} </P>
                    <P>on {route.createdOn.toLocaleDateString()} at {route.createdOn.toLocaleTimeString()} </P>
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