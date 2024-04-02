<script lang="ts">
import { onMount } from 'svelte';
import  SingleRoute from "$lib/components/SingleRoute.svelte"
import { LeafletMap } from '$lib';
export let data;

let userRouteEntries = data.props.userRouteEntries;
let adminGroups = data.props.adminGroups;


onMount(() => {
    console.log('user groups with admin perms', adminGroups);
});
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
    <div class="row">
        {#each userRouteEntries as route}
            {route.name} <br>
            {route.completionTime} <br>
            Uploaded by {route.creator} <br>
            on {route.createdOn} <br>
            <SingleRoute {route} />
        {/each}
    </div>
    <h1>Friend's Routes</h1>
</div>


