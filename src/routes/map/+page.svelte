<script lang="ts">
    import { LeafletMap } from '$lib';
    import type { RouteEntry } from '$lib/interfaces.js';
    import {
        Card,
        Sidebar,
        SidebarDropdownItem,
        SidebarDropdownWrapper,
        SidebarGroup,
        SidebarWrapper,
    } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    export let data;

    let map: LeafletMap;
    let selectedRoute: RouteEntry;
    let km: number;
    let miles: number;
    $: if (selectedRoute) [km, miles] = getRouteDistance(selectedRoute);

    let L;

    onMount(async () => {
        L = await import('leaflet');
    });

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

{#if data.userRoutes.length > 0}
    <Sidebar class="m-4 rounded drop-shadow">
        <SidebarWrapper>
            <SidebarGroup>
                <SidebarDropdownWrapper isOpen={true} label="User's Routes">
                    {#each data.userRoutes as route}
                        <SidebarDropdownItem on:click={() => map.selectRoute(route.name)} label={route.name} />
                    {/each}
                </SidebarDropdownWrapper>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
{/if}

{#if selectedRoute}
    <Card class="m-4">
        <h5 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">{selectedRoute.name}</h5>

        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Duration: {getRouteDuration(selectedRoute)}
        </p>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
            Distance: {km.toFixed(2)} km -> {miles.toFixed(2)} miles
        </p>
    </Card>
{/if}

<div style="position: absolute; top: 0; left: 0; z-index: -1;">
    <LeafletMap bind:this={map} bind:selectedRoute routes={data.userRoutes} />
</div>
