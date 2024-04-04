<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>


<script lang="ts">
    import type { RouteEntry} from '$lib/interfaces';
    import { Button, Input, Select,Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
    import { ArrowLeftOutline } from 'flowbite-svelte-icons';
    import SingleRoute from "$lib/components/SingleRoute.svelte";
    import { includes } from 'ramda';
    export let addRouteToGroup: (route:RouteEntry) => void;
    export let routeEntries:RouteEntry[] = [];
    export let nameOfList:string = "";
    export let adminGroupNames:string[] = [];
    export let updateCurrentPage: (value: string) => void;
    let searchTerm = "";

    let maxPerPage = 24;
    let currentPage = 0;

</script>
<Input type="text" bind:value={searchTerm} placeholder="Search routes..." />
<button style="display: flex" on:click={() => updateCurrentPage("Main")} role="button">
    <ArrowLeftOutline class="w-12 h-12 text-primary-700"  />
    <Heading> {nameOfList} </Heading>
    <Secondary>{routeEntries.length} routes </Secondary>
</button>
<div class="container">
    <div class="grid">
        {#each routeEntries.filter(route => (route.name.toLowerCase().includes(searchTerm.toLowerCase()) || route.creator.toLowerCase().includes(searchTerm.toLowerCase()))).slice(currentPage * maxPerPage, (currentPage + 1) * maxPerPage) as route}
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
        flex: 0 0 auto;
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>