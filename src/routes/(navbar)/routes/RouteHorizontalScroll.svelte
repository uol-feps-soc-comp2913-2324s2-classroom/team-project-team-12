<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>


<script lang="ts">
    import type {RouteEntry, user} from '$lib/interfaces';
    import { goto } from '$app/navigation';
    import {Card,List,Li, Button, Input, Select,Heading, Hr, P, A, Mark, Secondary } from 'flowbite-svelte';
    import { EyeOutline,EyeSlashOutline, PenOutline, CaretRightOutline } from 'flowbite-svelte-icons';
    import SingleRoute from "$lib/components/SingleRoute.svelte";

    export let user_id: number;
    export let addRouteToGroup: (route:RouteEntry) => void;
    export let routeEntries:RouteEntry[] = [];
    export let nameOfList:string = "";
    export let adminGroupNames:string[] = [];
    export let searchTerm = "";
    export let updateCurrentPage: (value: string) => void;
    export let showGroupOnMap: boolean;
    
    function toggleShowOnMap(route:RouteEntry) {
        const routeIndex = routeEntries.findIndex(r => r.id === route.id);
        routeEntries[routeIndex] = { ...route, showOnMap: !route.showOnMap };
        routeEntries = routeEntries;
        const formData = new FormData();
        formData.append('type', 'toggleShowRouteOnMap');
        formData.append('routeID', route.id.toString());
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', route.showOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                let actualResponse = data.data;
                actualResponse = JSON.parse(actualResponse);
                console.log('actual response', actualResponse);
            });
    }

    function toggleShowGroupOnMap(group: string) {
        const groupName = group;
        const formData = new FormData();
        formData.append('type', 'toggleShowGroupOnMap');
        formData.append('groupName', groupName);
        formData.append('userID', user_id.toString());
        formData.append('showOnMap', showGroupOnMap ? '1' : '0');
        fetch('/routes', {
            method: 'POST',
            body: formData
        });
        showGroupOnMap = !showGroupOnMap;

    }



    const editRoute = (route: RouteEntry) => {
        goto(`../edit_route/${route.id}`);
    }

</script>

<div class="container">
        <button on:click={() => updateCurrentPage(nameOfList)}>
        <Heading>{nameOfList} </Heading>
        <Secondary>{routeEntries.filter((r) => (r.name.toUpperCase().includes(searchTerm.toUpperCase())) || r.creator.toUpperCase().includes(searchTerm.toUpperCase())).length} routes </Secondary>
        </button>
        {#if !(nameOfList === "Your Routes" || nameOfList === "Public Routes" || nameOfList === "Friends Routes")}
        {#if showGroupOnMap}
            <Button color="blue" on:click={() => toggleShowGroupOnMap(nameOfList)}>
                    <EyeOutline />
            </Button>
        {:else}
            <Button color="red" on:click={() => toggleShowGroupOnMap(nameOfList)}>
                    <EyeSlashOutline />
            </Button>
        {/if}
        {/if}
    <Hr />
    <div class="scrollable-container">
        {#each routeEntries.slice(0, 10) as route, index}
        {#if (route.name.toUpperCase().includes(searchTerm.toUpperCase()) || route.creator.toUpperCase().includes(searchTerm.toUpperCase())) }
            <div class="flowbite-card">
                <Card size="none" padding="none" class="w-100 h-100 px-0 m-0">
                    <div class="map-container">
                            <div class="route-map" id="map">
                                <SingleRoute {route} />
                            </div>
                        {#if nameOfList === "Your Routes"}
                            <div class="edit-map-button">
                                <Button on:click={() => editRoute(route)}><PenOutline /></Button>
                            </div>
                        {/if}
                        {#if (nameOfList === "Your Routes" || nameOfList === "Friends Routes" || nameOfList === "Public Routes")}
                            <div class="show-map-buttons">
                                {#if route.showOnMap}
                                    <Button color='blue' on:click={() => toggleShowOnMap(route)}><EyeOutline /></Button>
                                {:else}
                                    <Button color='red' on:click={() => toggleShowOnMap(route)}><EyeSlashOutline /></Button>
                                {/if}        
                            </div>
                        {/if}
                    </div>
                    <div class="bottom-half">
                    
                    <Heading customSize="text-lg font-semibold">{route.name}</Heading>
                    <List list="none" tag="ul">
                    {#if route.completionTime > 60}
                    <Li>{Math.floor(route.completionTime / 60)} Hours {route.completionTime %60} Minutes</Li>
                    {:else}
                    <Li>{route.completionTime} Minutes</Li>
                    {/if}
                    <Li>Created by {route.creator}</Li>
                    <Li>Uploaded on {route.createdOn.toLocaleDateString()} at {route.createdOn.toLocaleTimeString()} </Li>
                    </List>
                {#if nameOfList === "Your Routes" || nameOfList === "Public Routes"}
                <div class="edit-show-box">
                    <Select bind:value={route.group}>
                        {#each adminGroupNames as group}
                            <option value={group}>{group}</option>
                        {/each}
                    </Select>
                    <Button on:click={() => addRouteToGroup(route)}>+</Button>
                </div>
                {/if}
                </div>
            </Card>
        </div>
        {/if}
    <div class="between-cards"></div>
    {/each}
    {#if routeEntries.length > 9}
        <Button class="see-more-button" size="xl" on:click={() => updateCurrentPage(nameOfList)}>
            <CaretRightOutline size="xl" />
        </Button>
    {/if}
</div>
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

    .between-cards {
        padding:1vw;
    }

    .bottom-half {
        position: relative;
        height:fit-content;
        display: flex;
        flex-direction: column;
        padding: 10px;
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
        top:0px;
        left:0px;
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

    .see-more-button {
        position: relative;
        width: 200px;
        height: 600px;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .group-show-button {
        width: 50px;
        height: 50px;
        justify-content: center;
        align-items: center;
    }

    .scrollable-container {
    display: flex;
    overflow-x: scroll;
    height: 700px;
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none;  /* For Internet Explorer and Edge */
    height: 100%;
    overflow-y: visible;
    padding-left: 50px;
    padding-right: 50px;
}

    .scrollable-container::-webkit-scrollbar {
        display: none; /* For Chrome, Safari and Opera */
    }

</style>