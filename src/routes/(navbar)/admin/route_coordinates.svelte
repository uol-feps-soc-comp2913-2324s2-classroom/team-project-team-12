<script lang="ts">
    import type { route_coordinate } from '$lib/interfaces';
    import { Button, Input,Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import Decimal from 'decimal.js';
    export let prop: route_coordinate[];
    let route_coordinates = prop;

    let currentPage = 0;
    let route_coordinatesPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (route_coordinate: route_coordinate) => {
        const formData = new FormData();
        formData.append('type', 'updateRouteCoordinate');
        formData.append('id', route_coordinate.id.toString());
        if (route_coordinate.route_id) formData.append('route_id', route_coordinate.route_id.toString());
        if (route_coordinate.latitude) formData.append('latitude', route_coordinate.latitude.toString());
        if (route_coordinate.longitude) formData.append('longitude', route_coordinate.longitude.toString());
        if (route_coordinate.order_position)
            formData.append('order_position', route_coordinate.order_position.toString());

        try {
            if (!formData.has('id')) {
                console.error('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                console.error('No type provided');
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Update successful');
            } else {
                console.error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    const handleUpdateAll = async () => {
        for (const route_coordinate of route_coordinates) {
            await handleUpdate(route_coordinate);
        }
    };

    const deleteRouteCoordinate = async (route_coordinate: route_coordinate) => {
        const formData = new FormData();
        formData.append('type', 'deleteRouteCoordinate');
        formData.append('id', route_coordinate.id.toString());

        try {
            if (!formData.has('id')) {
                console.error('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                console.error('No type provided');
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Delete successful');
                route_coordinates = route_coordinates.filter((rc) => rc.id !== route_coordinate.id);
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>
<Input type="text" bind:value={searchTerm} placeholder="Search..." />
<Table>
    <TableHead>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Route ID</TableHeadCell>
            <TableHeadCell>Latitude</TableHeadCell>
            <TableHeadCell>Longitude</TableHeadCell>
            <TableHeadCell>Order Position</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each route_coordinates.filter((rc) => (rc.route_id != null && rc.route_id.toString().includes(searchTerm))).slice(currentPage * route_coordinatesPerPage, (currentPage + 1) * route_coordinatesPerPage) as route_coordinate}
            {#if lockedFields == 1}
                <TableBodyRow>
                    <TableBodyCell>{route_coordinate.id}</TableBodyCell>
                    <TableBodyCell>{route_coordinate.route_id}</TableBodyCell>
                    <TableBodyCell>{route_coordinate.latitude}</TableBodyCell>
                    <TableBodyCell>{route_coordinate.longitude}</TableBodyCell>
                    <TableBodyCell>{route_coordinate.order_position}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if lockedFields == 0}
                <TableBodyRow>
                    <TableBodyCell>{route_coordinate.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route_coordinate.route_id} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route_coordinate.latitude} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route_coordinate.longitude} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route_coordinate.order_position} /></TableBodyCell>
                    <Button on:click={() => handleUpdate(route_coordinate)}>Submit</Button>
                    <Button on:click={() => deleteRouteCoordinate(route_coordinate)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if lockedFields == 0}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button on:click={nextPage} disabled={(currentPage + 1) * route_coordinatesPerPage >= route_coordinates.length}>Next</Button>
<div>
    Results Per Page
    <Select bind:value={route_coordinatesPerPage} on:change={() => currentPage = 0} >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>
