<script lang="ts">
    import type { group_route } from '$lib/interfaces';
    import {
        Button,
        Input,
        Select,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    export let prop: group_route[];
    let group_routes = prop;

    let currentPage = 0;
    let group_routesPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (group_route: group_route) => {
        const formData = new FormData();
        formData.append('type', 'updateGroupRoute');
        formData.append('id', group_route.id.toString());
        if (group_route.group_id) formData.append('group_id', group_route.group_id.toString());
        if (group_route.route_id) formData.append('route_id', group_route.route_id.toString());
        if (group_route.priority) formData.append('priority', group_route.priority.toString());
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
        for (const group_route of group_routes) {
            await handleUpdate(group_route);
        }
    };

    const deleteGroupRoute = async (group_route: group_route) => {
        const formData = new FormData();
        formData.append('type', 'deleteGroupRoute');
        formData.append('id', group_route.id.toString());
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
                group_routes = group_routes.filter((gr) => gr.id !== group_route.id);
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>

<Input type="text" bind:value={searchTerm} />
<Table>
    <TableHead>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Group ID</TableHeadCell>
        <TableHeadCell>Route ID</TableHeadCell>
        <TableHeadCell>Priority</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each group_routes
            .filter((gr) => (gr.route_id != null && gr.route_id
                            .toString()
                            .includes(searchTerm)) || (gr.group_id != null && gr.group_id
                            .toString()
                            .includes(searchTerm)))
            .slice(currentPage * group_routesPerPage, (currentPage + 1) * group_routesPerPage) as group_route}
            {#if lockedFields == 1}
                <TableBodyRow>
                    <TableBodyCell>{group_route.id}</TableBodyCell>
                    <TableBodyCell>{group_route.group_id}</TableBodyCell>
                    <TableBodyCell>{group_route.route_id}</TableBodyCell>
                    <TableBodyCell>{group_route.priority}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if lockedFields == 0}
                <TableBodyRow>
                    <TableBodyCell>{group_route.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group_route.group_id} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group_route.route_id} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group_route.priority} /></TableBodyCell>
                    <Button on:click={() => handleUpdate(group_route)}>Submit</Button>
                    <Button on:click={() => deleteGroupRoute(group_route)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if lockedFields == 0}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button pill color="light" on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button pill color="light" on:click={nextPage} disabled={(currentPage + 1) * group_routesPerPage >= group_routes.length}
    >Next</Button
>
<div>
    Results Per Page
    <Select bind:value={group_routesPerPage} on:change={() => (currentPage = 0)}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>
