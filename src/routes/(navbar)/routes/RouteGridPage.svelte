<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>


<script lang="ts">
    import type { GroupedRouteEntry} from '$lib/interfaces';
    import { Button, Input, Select,Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
    import SingleRoute from "$lib/components/SingleRoute.svelte";
    export let addRouteToGroup: (route:GroupedRouteEntry) => void;
    export let routeEntries:GroupedRouteEntry[] = [];
    export let nameOfList:string = "";
    export let adminGroupNames:string[] = [];
    let searchTerm = "";

    let maxPerPage = 24;
    let currentPage = 0;

</script>
<Heading> {nameOfList} </Heading>
<div class="container">
    <Input type="text" bind:value={searchTerm} placeholder="Search routes..." />
    <Heading> {nameOfList} </Heading>
    <div class="grid">
        {#each routeEntries.slice(currentPage * maxPerPage, (currentPage + 1) * maxPerPage) as route}
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
        {/each}
    </div>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    .grid-item {
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>