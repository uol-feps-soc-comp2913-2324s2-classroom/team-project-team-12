<script>
    import { GoogleMap, LeafletMap } from '$lib';
    import Settings from './settings.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let user;
    export let data;
    let API_KEY;

    onMount(() => {
        // Check if data is invalid and redirect if necessary
        if (data.invalid) {
            goto('/');
        } else {
            user = data.curUser;
        }

        // Assign API_KEY after the navigation check to prevent server-side rendering issues
        API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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

{#if !data.invalid}
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <GoogleMap />
        <LeafletMap />
    </div>

    <Settings />
{/if}
