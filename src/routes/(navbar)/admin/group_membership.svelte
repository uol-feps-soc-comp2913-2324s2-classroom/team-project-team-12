<script lang="ts">
    import type { group_membership } from '$lib/interfaces';
    import {
        Alert,
        Button,
        Input,
        Select,
        P,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    export let prop: group_membership[];
    let group_memberships = prop;

    let currentPage = 0;
    let group_membershipsPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };

    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    let currentErrors: string[] = [];

    const handleUpdate = async (group_membership: group_membership) => {
        const formData = new FormData();
        formData.append('type', 'updateGroupMembership');
        formData.append('id', group_membership.id.toString());
        if (group_membership.group_id) formData.append('group_id', group_membership.group_id.toString());
        if (group_membership.user_id) formData.append('user_id', group_membership.user_id.toString());
        formData.append('request', group_membership.request.toString());
        formData.append('member', group_membership.member.toString());
        formData.append('admin', group_membership.admin.toString());
        formData.append('invite', group_membership.invite.toString());
        console.log(group_membership.admin);
        try {
            if (!formData.has('id')) {
                currentErrors.push('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                currentErrors.push('Unknown Request');
                return;
            }
            if (!formData.has('group_id')) {
                currentErrors.push('No group_id provided');
            }
            if (!formData.has('user_id')) {
                currentErrors.push('No user_id provided');
            }
            if (!formData.has('group_id') || !formData.has('user_id')) {
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            currentErrors.push('Error during update');
        }
        console.log(currentErrors);
    };

    const handleUpdateAll = async () => {
        currentErrors = [];
        for (const group_membership of group_memberships) {
            await handleUpdate(group_membership);
        }
    };

    const deleteGroupMembership = async (group_membership: group_membership) => {
        currentErrors = [];
        const formData = new FormData();
        formData.append('type', 'deleteGroupMembership');
        formData.append('id', group_membership.id.toString());

        try {
            if (!formData.has('id')) {
                currentErrors.push('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                currentErrors.push('No type provided');
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Delete successful');
                group_memberships = group_memberships.filter((gm) => gm.id !== group_membership.id);
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
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Group ID</TableHeadCell>
        <TableHeadCell>User ID</TableHeadCell>
        <TableHeadCell>Request</TableHeadCell>
        <TableHeadCell>Member</TableHeadCell>
        <TableHeadCell>Admin</TableHeadCell>
        <TableHeadCell>Invite</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each group_memberships
            .filter((gm) => gm.group_id.toString().includes(searchTerm) || gm.user_id.toString().includes(searchTerm))
            .slice(currentPage * group_membershipsPerPage, (currentPage + 1) * group_membershipsPerPage) as group_membership}
            {#if lockedFields == 1}
                <TableBodyRow>
                    <TableBodyCell>{group_membership.id}</TableBodyCell>
                    <TableBodyCell>{group_membership.group_id}</TableBodyCell>
                    <TableBodyCell>{group_membership.user_id}</TableBodyCell>
                    <TableBodyCell>{group_membership.request}</TableBodyCell>
                    <TableBodyCell>{group_membership.member}</TableBodyCell>
                    <TableBodyCell>{group_membership.admin}</TableBodyCell>
                    <TableBodyCell>{group_membership.invite}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if lockedFields == 0}
                <TableBodyRow>
                    <TableBodyCell>{group_membership.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group_membership.group_id} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={group_membership.user_id} /></TableBodyCell>
                    <TableBodyCell
                        ><Select bind:value={group_membership.request}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={group_membership.member}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={group_membership.admin}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={group_membership.invite}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <Button
                        on:click={() => {
                            currentErrors = [];
                            handleUpdate(group_membership);
                        }}>Submit</Button
                    >
                    <Button on:click={() => deleteGroupMembership(group_membership)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>
<Button pill on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if !lockedFields}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button pill color="light" on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button
    pill
    color="light"
    on:click={nextPage}
    disabled={(currentPage + 1) * group_membershipsPerPage >= group_memberships.length}>Next</Button
>
<div>
    Results Per Page
    <Select bind:value={group_membershipsPerPage} on:change={() => (currentPage = 0)}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </Select>
</div>
<div>
    {#each currentErrors as error}
        <Alert><P>{error}</P></Alert>
    {/each}
</div>
