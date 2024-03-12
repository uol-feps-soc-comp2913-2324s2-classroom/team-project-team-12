<script lang="ts">
    import { GoogleMap, LeafletMap } from '$lib';

    let API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <GoogleMap />
    <LeafletMap />
</div>
