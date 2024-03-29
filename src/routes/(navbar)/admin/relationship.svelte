<script lang="ts">
    import type { relationship } from '$lib/interfaces';
    import { Button, Input,Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    export let prop: relationship[];
    let relationships = prop;

    let currentPage = 0;
    let relationshipsPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (relationship: relationship) => {
        const formData = new FormData();
        formData.append('type', 'updateRelationship');
        formData.append('id', relationship.id.toString());
        if (relationship.user_id1) formData.append('user_id1', relationship.user_id1.toString());
        if (relationship.user_id2) formData.append('user_id2', relationship.user_id2.toString());
        formData.append('friend_request', relationship.friend_request.toString());
        formData.append('is_friend', relationship.is_friend.toString());
        formData.append('is_blocked', relationship.is_blocked.toString());

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
        for (const relationship of relationships) {
            await handleUpdate(relationship);
        }
    };

    const deleteRelationship = async (relationship: relationship) => {
        const formData = new FormData();
        formData.append('type', 'deleteRelationship');
        formData.append('id', relationship.id.toString());

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
                relationships = relationships.filter((r) => r.id !== relationship.id);
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
            <TableHeadCell>id</TableHeadCell>
            <TableHeadCell>user_id1</TableHeadCell>
            <TableHeadCell>user_id2</TableHeadCell>
            <TableHeadCell>friend_request</TableHeadCell>
            <TableHeadCell>is_friend</TableHeadCell>
            <TableHeadCell>is_blocked</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each relationships.filter(((r) => r.user_id1.toString().includes(searchTerm) || r.user_id2.toString().includes(searchTerm))).slice(currentPage * relationshipsPerPage, (currentPage + 1) * relationshipsPerPage) as relationship}
            {#if lockedFields == 1}
                <TableBodyRow>
                    <TableBodyCell>{relationship.id}</TableBodyCell>
                    <TableBodyCell>{relationship.user_id1}</TableBodyCell>
                    <TableBodyCell>{relationship.user_id2}</TableBodyCell>
                    <TableBodyCell>{relationship.friend_request}</TableBodyCell>
                    <TableBodyCell>{relationship.is_friend}</TableBodyCell>
                    <TableBodyCell>{relationship.is_blocked}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if lockedFields == 0}
                <TableBodyRow>
                    <TableBodyCell>{relationship.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={relationship.user_id1} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={relationship.user_id2} /></TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={relationship.friend_request}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={relationship.is_friend}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={relationship.is_blocked}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <Button on:click={() => handleUpdate(relationship)}>Submit</Button>
                    <Button on:click={() => deleteRelationship(relationship)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if !lockedFields}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button on:click={nextPage} disabled={(currentPage + 1) * relationshipsPerPage >= relationships.length}>Next</Button>
<div>
    Results Per Page
    <Select bind:value={relationshipsPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>
