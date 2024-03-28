<script lang="ts">
    import { goto } from '$app/navigation';
    import { LeafletMap } from '$lib';
    import type { RouteEntry } from '$lib/interfaces.js';
    import {
        Button,
        Card,
        Sidebar,
        SidebarDropdownItem,
        SidebarDropdownWrapper,
        SidebarGroup,
        SidebarWrapper,
    } from 'flowbite-svelte';
    import { UploadSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';

    export let data;

    let map: LeafletMap;
    let selectedRoute: RouteEntry;
    let km: number;
    let miles: number;
    $: if (selectedRoute) [km, miles] = getRouteDistance(selectedRoute);

    let L: any;
    onMount(async () => (L = await import('leaflet')));

    const getRouteDistance = (route: RouteEntry) => {
        let totalDistance = 0;

        for (let i = 0; i < route.path.length - 1; i++) {
            let latLng: any = new L.latLng(route.path[i]);
            totalDistance += latLng.distanceTo(route.path[i + 1]);
        }

        let km = totalDistance / 1000;
        let miles = totalDistance / 1609.34;

        return [km, miles];
    };

    const getRouteDuration = (route: RouteEntry) => {
        let date = new Date(0);
        date.setSeconds(route.completionTime);
        return date.toISOString().substring(11, 19);
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

{#await data.userRoutes then userRoutes}
    {#if userRoutes.length > 0}
        <Sidebar class="m-4 max-h-[40vh] overflow-y-auto drop-shadow opacity-95">
            <SidebarWrapper>
                <SidebarGroup>
                    <SidebarDropdownWrapper
                        class="font-semibold text-gray-900 dark:text-white"
                        isOpen={true}
                        label="User's Routes"
                    >
                        {#each userRoutes as route}
                            <SidebarDropdownItem on:click={() => map.selectRoute(route.name)} label={route.name} />
                        {/each}
                    </SidebarDropdownWrapper>
                </SidebarGroup>
            </SidebarWrapper>
        </Sidebar>
    {/if}
{/await}

{#await data.groupRoutes then groupRoutes}
    {#if Object.keys(groupRoutes).length > 0}
        <Sidebar class="m-4 rounded max-h-[40vh] overflow-y-auto drop-shadow opacity-95">
            <SidebarWrapper>
                <span class="ms-3 pl-2 font-semibold text-gray-900 dark:text-white">Group Routes</span>
                <SidebarGroup border>
                    {#each Object.keys(groupRoutes) as group}
                        {#if Object.values(groupRoutes[group]).flat(1).length > 0}
                            <SidebarDropdownWrapper label={group}>
                                {#each Object.values(groupRoutes[group]).flat(1) as route}
                                    <SidebarDropdownItem
                                        on:click={() => map.selectRoute(route.name)}
                                        label={route.name}
                                    />
                                {/each}
                            </SidebarDropdownWrapper>
                        {/if}
                    {/each}
                </SidebarGroup>
            </SidebarWrapper>
        </Sidebar>
    {/if}
{/await}

{#if selectedRoute}
    <Card class="m-4 absolute right-0 md:top-[4.5em] top-[3.75em] opacity-95">
        <h5 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">{selectedRoute.name}</h5>

        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Created: {selectedRoute.createdOn.toLocaleDateString('en-GB')}
            at {selectedRoute.createdOn.toLocaleTimeString('en-GB')}
        </p>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Duration: {getRouteDuration(selectedRoute)}
        </p>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Distance: {km.toFixed(2)} km &lt;-&gt; {miles.toFixed(2)} miles
        </p>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Avg Speed: {(km / (selectedRoute.completionTime / 60 / 60)).toFixed(2)} km/h &lt;-&gt; {(
                miles /
                (selectedRoute.completionTime / 60 / 60)
            ).toFixed(2)} miles/h
        </p>
    </Card>
{/if}

<!-- Journeys Map -->
{#await Promise.all([data.userRoutes, data.groupRoutes])}
    <div
        class="mapContainer"
        style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;"
    >
        <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
            Loading...
        </div>
    </div>
{:then routes}
    <div class="mapContainer">
        <LeafletMap bind:this={map} bind:selectedRoute userRoutes={routes[0]} groupRoutes={routes[1]} />
    </div>
{/await}

<Button class="m-4 absolute bottom-0 right-0" color="red" size="xl" on:click={() => goto('/upload')}>
    <UploadSolid class="me-2" />
    Upload GPS Data</Button
>

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
</style>
