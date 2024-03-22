<script lang="ts">
    import { LeafletMap } from '$lib';

    export let data;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div style="position: absolute; top: 0; left: 0;">
    <LeafletMap {...data} />
</div>
