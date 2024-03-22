<script lang="ts">
    import type { route_coordinate } from '$lib/interfaces';
    import Decimal from 'decimal.js';
    export let prop: route_coordinate[];
    let route_coordinates = prop;

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
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Route ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Order Position</th>
        </tr>
    </thead>
    <tbody>
        {#each route_coordinates as route_coordinate}
            {#if lockedFields == 1}
                <tr>
                    <td>{route_coordinate.id}</td>
                    <td>{route_coordinate.route_id}</td>
                    <td>{route_coordinate.latitude}</td>
                    <td>{route_coordinate.longitude}</td>
                    <td>{route_coordinate.order_position}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{route_coordinate.id}</td>
                    <td><input type="text" bind:value={route_coordinate.route_id} /></td>
                    <td><input type="text" bind:value={route_coordinate.latitude} /></td>
                    <td><input type="text" bind:value={route_coordinate.longitude} /></td>
                    <td><input type="text" bind:value={route_coordinate.order_position} /></td>
                    <button on:click={() => handleUpdate(route_coordinate)}>Submit</button>
                    <button on:click={() => deleteRouteCoordinate(route_coordinate)}>Delete</button>
                </tr>
            {/if}
        {/each}
        <button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
    </tbody>
</table>
