<script lang="ts">
    import { goto } from '$app/navigation';
    import { LeafletMap } from '$lib';
    import type { RouteEntry } from '$lib/interfaces.js';
    import {
        Button,
        ButtonGroup,
        Card,
        Sidebar,
        SidebarDropdownItem,
        SidebarDropdownWrapper,
        SidebarGroup,
        SidebarWrapper,
        Popover,
    } from 'flowbite-svelte';
    import { CirclePlusSolid, DownloadSolid, UploadSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

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

<!-- User routes -->
{#await data.userRoutes then userRoutes}
    {#if userRoutes.length > 0}
        <Sidebar class="m-4 h max-h-[40vh] overflow-y-auto drop-shadow opacity-95">
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

<!-- Group Routes Selector -->
{#await data.groupRoutes then groupRoutes}
    <!-- Only show if group routes exist -->
    {#if Object.keys(groupRoutes).length > 0}
        <Sidebar class="m-4 rounded max-h-[40vh] overflow-y-auto drop-shadow opacity-95">
            <SidebarWrapper>
                <span class="ms-3 pl-2 font-semibold text-gray-900 dark:text-white">Group Routes</span>
                <SidebarGroup border>
                    <!-- List routes per group -->
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

<!-- Selected Route Card -->
{#if selectedRoute}
    <div transition:fade={{ duration: 150 }}>
        <Card class="m-4 absolute right-0 md:top-[4.5em] top-[3.75em] opacity-95">
            <!-- Route Name -->
            <div>
                <h5 class="mb-4 font-bold tracking-tight text-gray-900 dark:text-white inline-block">
                    {selectedRoute.name}
                </h5>
                <span class="float-right">
                    {selectedRoute.createdOn.toLocaleDateString('en-GB')}
                </span>
            </div>

            <!-- Optional Route Preview -->
            <!-- {#key selectedRoute}
            <SingleRoute route={selectedRoute} />
        {/key} -->

            <!-- Created By -->
            {#if data.user != selectedRoute.creator}
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                    Created By:
                    <span class="float-right">
                        {selectedRoute.creator}
                    </span>
                </p>
            {/if}

            <!-- Elapsed Time -->
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Elapsed Time:
                <span class="float-right">
                    {getRouteDuration(selectedRoute)}
                </span>
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
                    {(km / (selectedRoute.completionTime / 3600)).toFixed(2)} km/h ⟷
                    {(miles / (selectedRoute.completionTime / 3600)).toFixed(2)} miles/h
                </span>
            </p>
        </Card>
    </div>
{/if}

<!-- Journeys Map -->
{#await Promise.all([data.userRoutes, data.groupRoutes])}
    <div class="mapContainer flex justify-center">
        <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
            Loading...
        </div>
    </div>
{:then routes}
    <div class="mapContainer">
        <LeafletMap bind:this={map} bind:selectedRoute userRoutes={routes[0]} groupRoutes={routes[1]} />
    </div>
{/await}

<ButtonGroup class="space-x-px m-4 absolute bottom-0 right-0 opacity-95">
    <Button id="recordButton" class="px-4" size="xl" on:click={() => goto('/record')}>
        <CirclePlusSolid />
    </Button>
    <Popover class="w-64 opacity-95 text-sm font-light" title="Record New Route" triggeredBy="#recordButton">
        Record a new route live by walking around.
    </Popover>

    <Button id="uploadButton" class="px-4" size="xl" on:click={() => goto('/upload')}>
        <UploadSolid />
    </Button>
    <Popover class="w-64 opacity-95 text-sm font-light" title="Upload Routes" triggeredBy="#uploadButton">
        Upload routes to your account. Uses the GPX file format.
    </Popover>

    <Button id="downloadButton" size="xl" class="px-4" on:click={() => goto('/download')}>
        <DownloadSolid />
    </Button>
    <Popover class="w-64 opacity-95 text-sm font-light" title="Download Routes" triggeredBy="#downloadButton">
        Download your account's routes to a GPX file for later upload or use with third-party software.
    </Popover>
</ButtonGroup>

<style lang="sass">
    // Disable pointer events for body to enable draggable map
    :global(body)
        pointer-events: none
        overflow: hidden

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
