<script lang="ts">
    import type { group } from '$lib/interfaces';
    import { Button, Input,Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    export let prop: group[];
    let groups = prop;

    let currentPage = 0;
    let groupsPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (group: group) => {
        const formData = new FormData();
        formData.append('type', 'updateGroup');
        formData.append('id', group.id.toString());
        if (group.name) formData.append('name', group.name.toString());
        if (group.creator) formData.append('creator', group.creator.toString());
        if (group.publicity) formData.append('publicity', group.publicity.toString());

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
        for (const group of groups) {
            await handleUpdate(group);
        }
    };

    const deleteGroup = async (group: group) => {
        const formData = new FormData();
        formData.append('type', 'deleteGroup');
        formData.append('id', group.id.toString());

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
                groups = groups.filter((g) => g.id !== group.id);
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>

<Input type="text" bind:value={searchTerm} placeholder="Search" />
<Table>
    <TableHead>
            <TableHeadCell>id</TableHeadCell>
            <TableHeadCell>name</TableHeadCell>
            <TableHeadCell>creator</TableHeadCell>
            <TableHeadCell>publicity</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each groups.filter((g) => (g.id.toString().includes(searchTerm) || g.name.includes(searchTerm) || g.creator.toString().includes(searchTerm))).slice(currentPage * groupsPerPage, (currentPage + 1) * groupsPerPage) as group}
            {#if lockedFields == 1}
                <TableBodyRow>
                    <TableBodyCell>{group.id}</TableBodyCell>
                    <TableBodyCell>{group.name}</TableBodyCell>
                    <TableBodyCell>{group.creator}</TableBodyCell>
                    <TableBodyCell>{group.publicity}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if lockedFields == 0}
                <TableBodyRow>
                    <TableBodyCell>{group.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group.name} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group.creator} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group.publicity} /></TableBodyCell>
                    <Button on:click={() => handleUpdate(group)}>Submit</Button>
                    <Button on:click={() => deleteGroup(group)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button pill on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if !lockedFields}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button pill on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button pill on:click={nextPage} disabled={(currentPage + 1) * groupsPerPage >= groups.length}>Next</Button>
<div>
    Results Per Page
    <Select bind:value={groupsPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>