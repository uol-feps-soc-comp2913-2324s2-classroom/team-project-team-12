<script lang="ts">
    import type { RouteEntry } from '$lib/interfaces';
    import {
        Hr,
        Button,
        Input,
        Select,
        Heading,
        P,
        A,
        Mark,
        Secondary,
        Card,
        List,
        Li,
        Breadcrumb,
        BreadcrumbItem,
        Tooltip,
    } from 'flowbite-svelte';
    import { ArrowLeftOutline, EyeSlashOutline, EyeOutline, PenOutline } from 'flowbite-svelte-icons';
    import SingleRoute from '$lib/components/SingleRoute.svelte';
    import { goto } from '$app/navigation';
    import AddGroup from '../groups/addGroup.svelte';
    export let addRouteToGroup: (route: RouteEntry) => void;
    export let routeEntries: RouteEntry[] = [];
    export let nameOfList: string = '';
    export let adminGroupNames: string[] = [];
    export let updateCurrentPage: (value: string) => void;
    export let showGroupOnMap: boolean;
    export let user_id: number;
    export let searchTerm: string = '';
    let maxPerPage = 24;
    let currentPage = 0;

    const editRoute = (route: RouteEntry) => {
        goto(`../edit_route/${route.id}`);
    };

    function toggleShowGroupOnMap(group: string) {
        const groupName = group;
        const formData = new FormData();
        formData.append('type', 'toggleShowGroupOnMap');
        formData.append('groupName', groupName);
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', showGroupOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData,
        });
        showGroupOnMap = !showGroupOnMap;
        location.reload();
    }

    function toggleShowOnMap(route: RouteEntry) {
        const routeIndex = routeEntries.findIndex((r) => r.id === route.id);
        routeEntries[routeIndex] = { ...route, showOnMap: !route.showOnMap };
        routeEntries = routeEntries;
        const formData = new FormData();
        formData.append('type', 'toggleShowRouteOnMap');
        formData.append('routeID', route.id.toString());
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', route.showOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                let actualResponse = data.data;
                actualResponse = JSON.parse(actualResponse);
                console.log('actual response', actualResponse);
            });
    }

    let pageIndex = 0;
    let itemsPerPage = 8;

    function nextPage() {
        if (pageIndex < routeEntries.length / itemsPerPage - 1) {
            pageIndex++;
        }
    }

    function prevPage() {
        if (pageIndex > 0) {
            pageIndex--;
        }
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<Input type="text" bind:value={searchTerm} placeholder="Search routes..." />

<div class="container">
    <div class="top-section">
        <div class="left-top-section">
            <Breadcrumb>
                <Button
                    color="alternative"
                    style="display: flex"
                    on:click={() => updateCurrentPage('Main')}
                    role="button"
                >
                    <BreadcrumbItem on:click={() => updateCurrentPage('Main')}>Routes</BreadcrumbItem>
                </Button>
                <Tooltip>Go back to routes</Tooltip>
                <BreadcrumbItem>{nameOfList}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="top-mid-section">
            <button on:click={() => updateCurrentPage(nameOfList)}>
                <Heading>{nameOfList}</Heading>
                <Secondary
                    >{routeEntries.filter(
                        (r) =>
                            r.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
                            r.creator.toUpperCase().includes(searchTerm.toUpperCase()),
                    ).length} routes
                </Secondary>
            </button>
            {#if !(nameOfList === 'Your Routes' || nameOfList === 'Public Routes' || nameOfList === 'Friends Routes')}
                {#if showGroupOnMap}
                    <Button color="blue" on:click={() => toggleShowGroupOnMap(nameOfList)}>
                        <EyeOutline />
                    </Button>
                    <Tooltip>Hide on map</Tooltip>
                {:else}
                    <Button color="red" on:click={() => toggleShowGroupOnMap(nameOfList)}>
                        <EyeSlashOutline />
                    </Button>
                    <Tooltip>Show on map</Tooltip>
                {/if}
            {/if}
        </div>
        <div class="top-right-section">
            <div class="next-last">
                <Button on:click={prevPage} disabled={pageIndex === 0}>Previous</Button>
                <Button on:click={nextPage} disabled={pageIndex * itemsPerPage >= routeEntries.length - itemsPerPage}
                    >Next</Button
                >
            </div>
            <Heading customSize="text-lg font-semibold">Routes per page</Heading>
            <Select bind:value={itemsPerPage} on:change={() => (pageIndex = 0)}>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="20">20</option>
            </Select>
        </div>
    </div>
    <Hr />
    <div class="grid-container">
        {#each routeEntries
            .filter((r) => r.name.toUpperCase().includes(searchTerm.toUpperCase()) || r.creator
                        .toUpperCase()
                        .includes(searchTerm.toUpperCase()))
            .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage) as route}
            <div class="flowbite-card">
                <Card size="none" padding="none" class="w-100 h-100 px-0 m-0">
                    <div class="map-container">
                        <div class="route-map" id="map">
                            <SingleRoute {route} />
                        </div>
                        {#if nameOfList === 'Your Routes'}
                            <div class="edit-map-button">
                                <Button on:click={() => editRoute(route)}><PenOutline /></Button>
                                <Tooltip>Edit route</Tooltip>
                            </div>
                        {/if}
                        {#if nameOfList === 'Your Routes' || nameOfList === 'Friends Routes' || nameOfList === 'Public Routes'}
                            <div class="show-map-buttons">
                                {#if route.showOnMap}
                                    <Button color="blue" on:click={() => toggleShowOnMap(route)}><EyeOutline /></Button>
                                    <Tooltip>Hide on map</Tooltip>
                                {:else}
                                    <Button color="red" on:click={() => toggleShowOnMap(route)}
                                        ><EyeSlashOutline /></Button
                                    >
                                    <Tooltip>Show on map</Tooltip>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    <div class="bottom-half">
                        <Heading customSize="text-lg font-semibold">{route.name}</Heading>
                        <List list="none" tag="ul">
                            {#if route.completionTime > 3600}
                                <Li
                                    >{Math.floor(route.completionTime / 3600)} Hours {Math.floor(
                                        (route.completionTime % 3600) / 60,
                                    )} Minutes {route.completionTime % 60} Seconds
                                </Li>
                            {:else if route.completionTime > 60}
                                <Li
                                    >{Math.floor(route.completionTime / 60)} Minutes {route.completionTime % 60} Seconds
                                </Li>
                            {:else}
                                <Li>{route.completionTime} Seconds</Li>
                            {/if}
                            <Li>Created by {route.creator}</Li>
                            <Li
                                >Uploaded on {route.createdOn.toLocaleDateString()} at {route.createdOn.toLocaleTimeString()}
                            </Li>
                        </List>
                        {#if nameOfList === 'Your Routes' || nameOfList === 'Public Routes'}
                            <div class="edit-show-box">
                                <Select bind:value={route.group}>
                                    {#each adminGroupNames as group}
                                        <option value={group}>{group}</option>
                                    {/each}
                                </Select>
                                <Button on:click={() => addRouteToGroup(route)}>+</Button>
                                <Tooltip>Add route to group</Tooltip>
                            </div>
                        {/if}
                    </div>
                </Card>
            </div>
        {/each}
    </div>
    <Hr />
</div>

<style>
    .container {
        max-width: none;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: left;
        max-width: none;
    }

    .top-section {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
    }

    .right-top-section {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .bottom-half {
        position: relative;
        height: fit-content;
        display: flex;
        flex-direction: column;
        padding: 15px;
    }

    .flowbite-card {
        width: 400px;
        height: 600px;
        margin: 1vh;
        color: white;
        padding: 0px;
        margin: 0px;
    }

    .map-container {
        padding: 0px;
        margin: 0px;
        position: relative;
        margin: 1vh;
        width: 380px;
        height: 380px;
    }
    .route-map {
        z-index: 50;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }

    .show-map-buttons {
        z-index: 100;
        position: absolute;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
    }

    .edit-map-button {
        z-index: 100;
        position: absolute;
        top: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
    }
    .edit-show-box {
        z-index: 100;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .group-show-button {
        width: 50px;
        height: 50px;
        justify-content: center;
        align-items: center;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(400px, 2fr)
        ); /* Adjust the minmax values to control the column width */
        grid-gap: 1rem; /* Adjust the grid-gap value to control the space between grid items */
        padding: 1rem;
    }
    .scrollable-container::-webkit-scrollbar {
        display: none; /* For Chrome, Safari and Opera */
    }
</style>
