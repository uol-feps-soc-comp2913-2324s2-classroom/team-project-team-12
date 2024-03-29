<script lang="ts">
    import type { route } from '$lib/interfaces';
    import { Button, Input,Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    export let prop: route[];
    let routes = prop;

    let currentPage = 0;
    let routesPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (route: route) => {
        const formData = new FormData();
        formData.append('type', 'updateRoute');
        formData.append('id', route.id.toString());
        if (route.route_name) formData.append('route_name', route.route_name);
        if (route.created_on) formData.append('created_on', route.created_on.toString());
        if (route.length) formData.append('length', route.length.toString());
        if (route.approximate_completion_time)
            formData.append('approximate_completion_time', route.approximate_completion_time.toString());
        if (route.creator) formData.append('creator', route.creator.toString());
        if (route.publicity) formData.append('publicity', route.publicity.toString());

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
        for (const route of routes) {
            await handleUpdate(route);
        }
    };

    const deleteRoute = async (route: route) => {
        const formData = new FormData();
        formData.append('type', 'deleteRoute');
        formData.append('id', route.id.toString());

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
                routes = routes.filter((r) => r.id !== route.id);
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>

<Input type="text" placeholder="Search..." bind:value={searchTerm} />
<Table>
    <TableHead>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Route Name</TableHeadCell>
        <TableHeadCell>Created On</TableHeadCell>
        <TableHeadCell>Length</TableHeadCell>
        <TableHeadCell>Approx. Completion Time</TableHeadCell>
        <TableHeadCell>Creator</TableHeadCell>
        <TableHeadCell>Publicity</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each routes
            .filter((route) => route.id
                        .toString()
                        .includes(searchTerm) || (route.route_name != null && route.route_name.includes(searchTerm)) || (route.creator != null && route.creator
                            .toString()
                            .includes(searchTerm)))
            .slice(currentPage * routesPerPage, (currentPage + 1) * routesPerPage) as route}
            {#if lockedFields}
                <TableBodyRow>
                    <TableBodyCell>{route.id}</TableBodyCell>
                    <TableBodyCell>{route.route_name}</TableBodyCell>
                    <TableBodyCell>{route.created_on}</TableBodyCell>
                    <TableBodyCell>{route.length}</TableBodyCell>
                    <TableBodyCell>{route.approximate_completion_time}</TableBodyCell>
                    <TableBodyCell>{route.creator}</TableBodyCell>
                    <TableBodyCell>{route.publicity}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if !lockedFields}
                <TableBodyRow>
                    <TableBodyCell>{route.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.route_name} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.created_on} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.length} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.approximate_completion_time} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.creator} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={route.publicity} /></TableBodyCell>
                    <Button color="blue" on:click={() => handleUpdate(route)}>Submit</Button>
                    <Button color="red" on:click={() => deleteRoute(route)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button color="dark" pill on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if !lockedFields}
    <Button color="green" pill on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button pill color="light" on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button pill color="light" on:click={nextPage} disabled={(currentPage + 1) * routesPerPage >= routes.length}>Next</Button>
<div>
    Results Per Page
    <Select bind:value={routesPerPage} on:change={() => (currentPage = 0)}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>
