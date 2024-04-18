<script lang="ts">
    import { goto } from '$app/navigation';
    import { LeafletMap } from '$lib';
    import SingleRoute from '$lib/components/SingleRoute.svelte';
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
        Tabs,
        TabItem,
        Li,
        List,
        Badge,
        Accordion,
        AccordionItem,
    } from 'flowbite-svelte';
    import {
        CirclePlusSolid,
        DownloadSolid,
        GlobeSolid,
        UploadSolid,
        UserCircleSolid,
        UsersGroupSolid,
        EyeOutline,
        MapPinAltOutline,
        MapPinAltSolid,
        CloseOutline,
        EyeSlashOutline,
        LayersSolid,
    } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Svrollbar } from 'svrollbar';

    export let data;

    let selectedTab = 'User';
    let tabColor = {
        User: 'red',
        Public: 'blue',
        Group: 'green',
    };
    let showRoutesMenu = true;

    let map: LeafletMap;
    let selectedRoute: RouteEntry;
    let km: number;
    let miles: number;
    $: if (selectedRoute) [km, miles] = getRouteDistance(selectedRoute);

    let routesShowOnMap = {};

    let L: any;
    onMount(async () => {
        L = await import('leaflet');

        for (let id in await data.userRoutes) routesShowOnMap[id] = true;
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

<!-- User routes -->
{#if showRoutesMenu}
    <div class="routeSelector w-72 m-4 bg-white dark:bg-gray-900 opacity-90 shadow-lg rounded-md">
        <div class="windowHeader flex items-center">
            <Button
                pill
                color="alternative"
                size="sm"
                class="m-2 p-1 border-none"
                on:click={() => (showRoutesMenu = false)}
            >
                <CloseOutline />
            </Button>
            <h5 class="text-md font-medium text-gray-900 dark:text-white inline flex-1">Routes</h5>
            <Badge large border color={tabColor[selectedTab]} class="mr-5">{selectedTab}</Badge>
        </div>
        <Tabs style="underline">
            <!-- User routes -->
            <TabItem open class="flex-1" on:click={() => (selectedTab = 'User')}>
                <div slot="title">
                    <UserCircleSolid class="w-6 h-6" />
                </div>
                {#await data.userRoutes}
                    <Card>Loading...</Card>
                {:then userRoutes}
                    {#if userRoutes.filter((r) => r.creator == data.user).length == 0}
                        <Card>No user routes selected</Card>
                    {:else}
                        {#each userRoutes as route (route.id)}
                            {#if route.creator == data.username}
                                <List
                                    tag="ul"
                                    list="none"
                                    class="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    <Li icon class="py-2 sm:py-3">
                                        {#if selectedRoute != undefined && route.id == selectedRoute.id}
                                            <MapPinAltSolid class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400" />
                                        {:else}
                                            <MapPinAltOutline class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400" />
                                        {/if}
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                                        <div
                                            class="flex flex-1 items-center space-x-4 rtl:space-x-reverse hover:cursor-pointer"
                                            on:click|stopPropagation={() => map.selectRoute(route.id)}
                                        >
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {route.name}
                                                </p>
                                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {route.createdOn.toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                            <div
                                                class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                {#if routesShowOnMap[route.id] == undefined || routesShowOnMap[route.id]}
                                                    <Button
                                                        pill
                                                        color="alternative"
                                                        class="px-2.5 border-none"
                                                        on:click={() => {
                                                            routesShowOnMap[route.id] = false;
                                                            map.hideRoute(route.id);
                                                        }}
                                                    >
                                                        <EyeOutline />
                                                    </Button>
                                                {:else}
                                                    <Button
                                                        pill
                                                        color="alternative"
                                                        class="px-2.5 border-none"
                                                        on:click={() => {
                                                            routesShowOnMap[route.id] = true;
                                                            map.showRoute(route.id);
                                                        }}
                                                    >
                                                        <EyeSlashOutline />
                                                    </Button>
                                                {/if}
                                            </div>
                                        </div>
                                    </Li>
                                </List>
                            {/if}
                        {/each}
                    {/if}
                {/await}
            </TabItem>

            <!-- Group routes -->
            <TabItem class="flex-1" on:click={() => (selectedTab = 'Group')}>
                <div slot="title">
                    <UsersGroupSolid class="w-6 h-6" />
                </div>
                {#await data.groupRoutes}
                    <Card>Loading...</Card>
                {:then groupRoutes}
                    {#if Object.values(groupRoutes).length == 0}
                        <Card>No group routes selected</Card>
                    {:else}
                        <Accordion flush>
                            {#each Object.keys(groupRoutes) as group}
                                <AccordionItem>
                                    <span slot="header">{group}</span>
                                    {#each groupRoutes[group] as route (route.id)}
                                        <List
                                            tag="ul"
                                            list="none"
                                            class="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                        >
                                            <Li icon class="py-2 sm:py-3">
                                                {#if selectedRoute != undefined && route.id == selectedRoute.id}
                                                    <MapPinAltSolid
                                                        class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400"
                                                    />
                                                {:else}
                                                    <MapPinAltOutline
                                                        class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400"
                                                    />
                                                {/if}
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                                <div
                                                    class="flex flex-1 items-center space-x-4 rtl:space-x-reverse hover:cursor-pointer"
                                                    on:click|stopPropagation={() => map.selectRoute(route.id)}
                                                >
                                                    <div class="flex-1 min-w-0">
                                                        <p
                                                            class="text-sm font-medium text-gray-900 truncate dark:text-white"
                                                        >
                                                            {route.name}
                                                        </p>
                                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                            by {route.creator}
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                                                    >
                                                        {#if routesShowOnMap[route.id] == undefined || routesShowOnMap[route.id]}
                                                            <Button
                                                                pill
                                                                color="alternative"
                                                                class="px-2.5 border-none"
                                                                on:click={() => {
                                                                    routesShowOnMap[route.id] = false;
                                                                    map.hideRoute(route.id);
                                                                }}
                                                            >
                                                                <EyeOutline />
                                                            </Button>
                                                        {:else}
                                                            <Button
                                                                pill
                                                                color="alternative"
                                                                class="px-2.5 border-none"
                                                                on:click={() => {
                                                                    routesShowOnMap[route.id] = true;
                                                                    map.showRoute(route.id);
                                                                }}
                                                            >
                                                                <EyeSlashOutline />
                                                            </Button>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </Li>
                                        </List>
                                    {/each}
                                    <!-- {#each groupRoutes[group] as route}{/each} -->
                                </AccordionItem>
                            {/each}
                        </Accordion>
                    {/if}
                {/await}
            </TabItem>

            <!-- Public routes -->
            <TabItem class="flex-1" on:click={() => (selectedTab = 'Public')}>
                <div slot="title">
                    <GlobeSolid class="w-6 h-6" />
                </div>
                {#await data.userRoutes}
                    <Card>Loading...</Card>
                {:then userRoutes}
                    {#if userRoutes.filter((r) => r.creator != data.user).length == 0}
                        <Card>No public routes selected</Card>
                    {:else}
                        {#each userRoutes as route (route.id)}
                            {#if route.creator != data.username}
                                <List
                                    tag="ul"
                                    list="none"
                                    class="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    <Li icon class="py-2 sm:py-3">
                                        {#if selectedRoute != undefined && route.id == selectedRoute.id}
                                            <MapPinAltSolid class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400" />
                                        {:else}
                                            <MapPinAltOutline class="w-5 h-5 me-4 text-gray-500 dark:text-gray-400" />
                                        {/if}
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                                        <div
                                            class="flex flex-1 items-center space-x-4 rtl:space-x-reverse hover:cursor-pointer"
                                            on:click|stopPropagation={() => map.selectRoute(route.id)}
                                        >
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {route.name}
                                                </p>
                                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    by {route.creator}
                                                </p>
                                            </div>
                                            <div
                                                class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                {#if routesShowOnMap[route.id] == undefined || routesShowOnMap[route.id]}
                                                    <Button
                                                        pill
                                                        color="alternative"
                                                        class="px-2.5 border-none"
                                                        on:click={() => {
                                                            routesShowOnMap[route.id] = false;
                                                            map.hideRoute(route.id);
                                                        }}
                                                    >
                                                        <EyeOutline />
                                                    </Button>
                                                {:else}
                                                    <Button
                                                        pill
                                                        color="alternative"
                                                        class="px-2.5 border-none"
                                                        on:click={() => {
                                                            routesShowOnMap[route.id] = true;
                                                            map.showRoute(route.id);
                                                        }}
                                                    >
                                                        <EyeSlashOutline />
                                                    </Button>
                                                {/if}
                                            </div>
                                        </div>
                                    </Li>
                                </List>
                            {/if}
                        {/each}
                    {/if}
                {/await}
            </TabItem>
        </Tabs>
    </div>
{:else}
    <ButtonGroup>
        <Button
            color="alternative"
            class="p-2.5 border-none m-4 shadow-lg rounded-md"
            on:click={() => (showRoutesMenu = true)}
        >
            <LayersSolid size="lg" />
        </Button>
    </ButtonGroup>
{/if}

<!-- Selected Route Card -->
{#if selectedRoute}
    <div transition:fade={{ duration: 150 }}>
        <Card class="m-4 absolute right-0 md:top-[4.5em] top-[3.75em] opacity-90 rounded-md shadow-lg">
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
                <p class="mb-3 font-medium tracking-tighter text-gray-700 dark:text-gray-400 leading-tight">
                    Created By:
                    <span class="float-right font-normal">
                        {selectedRoute.creator}
                    </span>
                </p>
            {/if}

            <!-- Elapsed Time -->
            <p class="mb-3 font-medium tracking-tighter text-gray-700 dark:text-gray-400 leading-tight">
                Elapsed Time:
                <span class="float-right font-normal">
                    {getRouteDuration(selectedRoute)}
                </span>
            </p>

            <!-- Total Distance -->
            <p class="mb-3 font-medium tracking-tighter text-gray-700 dark:text-gray-400 leading-tight">
                Total Distance:
                <span class="float-right font-normal">
                    {km.toFixed(2)} km ⟷ {miles.toFixed(2)} miles
                </span>
            </p>

            <!-- Average Speed -->
            <p class="mb-3 font-medium tracking-tighter text-gray-700 dark:text-gray-400 leading-tight">
                Average Speed:
                <span class="float-right font-normal">
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

<ButtonGroup class="space-x-px m-4 fixed bottom-0 right-0 opacity-95 shadow-lg">
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
        overflow-x: hidden
        // height: 2000px

    // Re-enable pointer events for child elements
    :global(body > *)
        pointer-events: auto

    :global(nav)
        opacity: 98%

    .mapContainer
        position: fixed
        top: 0
        left: 0
        z-index: -1
        width: 100vw
        height: 100vh

    :global(.routeSelector > ul > li > button)
        width: 100%
        display: flex
        justify-content: center

    :global([role=tabpanel])
        border-radius: 0 !important
        border-bottom-left-radius: 0.375rem !important
        border-bottom-right-radius: 0.375rem !important
        margin-top: 0 !important
</style>
