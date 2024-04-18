<script lang="ts">
    import { LeafletMap } from '$lib';
    import type { RouteEntry } from '$lib/interfaces.js';
    import { Button, Card, Input, Label, Modal } from 'flowbite-svelte';
    import { CirclePlusSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
    import type { LatLngTuple, Map, Marker, Polyline } from 'leaflet';
    import { pipe } from 'ramda';
    import { onMount } from 'svelte';

    export let data;

    let map: Map;
    let km: number;
    let miles: number;
    let error: string;
    $: [km, miles] = getRouteDistance(path);

    let marker: Marker;
    let polyline: Polyline;
    let timerInterval: NodeJS.Timeout;
    let lastPos: LatLngTuple;
    let routeNamePrompt = false;
    let routeName: string;

    $: if (recording) polyline.setLatLngs(path);

    let recording = false;
    let elapsedTime = 0;
    let path: LatLngTuple[] = [];

    // Convert GeolocationPosition to LatLngTuple
    const coordsToLatLngTuple = (position: GeolocationPosition) =>
        [position.coords.latitude, position.coords.longitude] as LatLngTuple;

    // Update the marker to the provided location
    const moveMarkerToPoint = (point: LatLngTuple) => {
        if (map) {
            map.panTo(point);

            if (marker) map.removeLayer(marker);
            marker = L.marker(point);
            map.addLayer(marker);
        }

        return point;
    };

    // Append a new location to `path`
    const appendPointToPath = (point: LatLngTuple) => {
        if (recording) path = [...path, point];
        lastPos = point;
    };

    // Create location update handlers
    const handleLocationUpdate = pipe(coordsToLatLngTuple, moveMarkerToPoint, appendPointToPath);
    const handleLocationError = (e: GeolocationPositionError) => (error = e.message);

    // Initialize and start recording a new route
    const startRecording = () => {
        // Reinitialize all values
        recording = true;
        elapsedTime = 0;
        path = [lastPos];

        // Start recording the duration of the walk
        timerInterval = setInterval(() => {
            elapsedTime++;
        }, 1000);

        // Show the polyline on the map
        polyline.setStyle({ color: 'red' });
        map.removeLayer(polyline);
        map.addLayer(polyline);
    };

    // Handle the end of a route recording
    const stopRecording = () => {
        recording = false;

        // Uninitialize all values
        clearInterval(timerInterval);
        routeNamePrompt = true;
        polyline.setStyle({ color: 'blue' });
    };

    // Initialize the program on page load
    let L: any;
    onMount(async () => {
        L = await import('leaflet');

        navigator.geolocation.watchPosition(handleLocationUpdate, handleLocationError, { enableHighAccuracy: true });

        polyline = L.polyline([], {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1,
        });
    });

    // Calculate the total distance between points in a path
    const getRouteDistance = (path: LatLngTuple[]) => {
        let totalDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            let latLng: any = new L.latLng(path[i]);
            totalDistance += latLng.distanceTo(path[i + 1]);
        }

        let km = totalDistance / 1000;
        let miles = totalDistance / 1609.34;

        return [km, miles];
    };

    // Converts an elapsedTime into an ISOString time
    const getRouteDuration = (elapsedTime: number) => {
        let date = new Date(0);
        date.setSeconds(elapsedTime);
        return date.toISOString().substring(11, 19);
    };

    // Submits the new route to DB
    const submitRoute = () => {
        //@ts-ignore
        let route: RouteEntry = {
            name: routeName,
            creator: data.username,
            completionTime: elapsedTime,
            path,
        };

        fetch('/record', {
            method: 'POST',
            body: JSON.stringify(route),
        });

        routeNamePrompt = false;
        routeName = '';
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

<!-- Handle errors -->
{#if error}
    <div class="mapContainer flex justify-center">
        <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
            {error} :(
        </div>
    </div>
{:else}
    <!-- Selected Route Card -->
    {#if recording}
        <Card class="m-4 absolute right-0 md:top-[4.5em] top-[3.75em] opacity-95">
            <!-- Route Name -->
            <div>
                <h5 class="mb-4 font-bold tracking-tight text-gray-900 dark:text-white inline-block">
                    Recording New Route...
                </h5>
                <span class="float-right">
                    {new Date().toLocaleDateString('en-GB')}
                </span>
            </div>

            <!-- Elapsed Time -->
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Elapsed Time:
                <span class="float-right">{getRouteDuration(elapsedTime)}</span>
            </p>

            <!-- Total Distance -->
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Total Distance:
                <span class="float-right">
                    {km.toFixed(2)} km ⟷ {miles.toFixed(2)} miles
                </span>
            </p>

            <!-- Average Speed -->
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Average Speed:
                <span class="float-right">
                    {(km / (elapsedTime / 3600) || 0).toFixed(2)} km/h ⟷
                    {(miles / (elapsedTime / 3600) || 0).toFixed(2)} miles/h
                </span>
            </p>
        </Card>
    {/if}

    <!-- Journeys Map -->
    <div class="mapContainer">
        <LeafletMap bind:map userRoutes={[]} groupRoutes={{}} />
    </div>

    <!-- Stop and start recording button -->
    {#if recording}
        <Button class="m-4 absolute bottom-0 right-0" color="red" size="xl" on:click={stopRecording}>
            <CloseCircleSolid class="me-2" />
            Stop Recording Route
        </Button>
    {:else}
        <Button class="m-4 absolute bottom-0 right-0" color="blue" size="xl" on:click={startRecording}>
            <CirclePlusSolid class="me-2" />
            Start Recording Route
        </Button>
    {/if}
{/if}

<!-- New route name prompt -->
<Modal bind:open={routeNamePrompt} size="xs" dismissable={false} class="w-full">
    <form class="flex flex-col space-y-6" action="#">
        <Label class="block text-md">New Route Name</Label>
        <Input bind:value={routeName} type="text" name="routeName" required />
        <div class="w-full">
            <Button on:click={submitRoute}>Submit</Button>
            <Button on:click={() => (routeNamePrompt = false)} color="alternative">Cancel</Button>
        </div>
    </form>
</Modal>

<style lang="sass">
    // Disable pointer events for body to enable draggable map
    :global(body)
        pointer-events: none

    // Re-enable pointer events for child elements
    :global(body > *)
        pointer-events: auto

    :global(nav)
        opacity: 98%

    .mapContainer
        position: absolute
        top: 0
        left: 0
        z-index: -1
        width: 100vw
        height: 100vh
</style>
