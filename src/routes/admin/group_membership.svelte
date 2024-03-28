<script lang="ts">
    import type { group_membership } from '$lib/interfaces';

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

    const handleUpdate = async (group_membership: group_membership) => {
        const formData = new FormData();
        formData.append('type', 'updateGroupMembership');
        formData.append('id', group_membership.id.toString());
        if (group_membership.group_id) formData.append('group_id', group_membership.group_id.toString());
        if (group_membership.user_id) formData.append('user_id', group_membership.user_id.toString());
        formData.append('request', group_membership.request.toString());
        formData.append('member', group_membership.member.toString());
        formData.append('admin', group_membership.admin.toString());
        console.log(group_membership.admin);
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
        for (const group_membership of group_memberships) {
            await handleUpdate(group_membership);
        }
    };

    const deleteGroupMembership = async (group_membership: group_membership) => {
        const formData = new FormData();
        formData.append('type', 'deleteGroupMembership');
        formData.append('id', group_membership.id.toString());

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
<input type="text" bind:value={searchTerm} placeholder="Search" />
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Group ID</th>
            <th>User ID</th>
            <th>Request</th>
            <th>Member</th>
            <th>Admin</th>
        </tr>
    </thead>
    <tbody>
        {#each group_memberships.filter((gm) => (gm.group_id.toString().includes(searchTerm) || gm.user_id.toString().includes(searchTerm))).slice(currentPage * group_membershipsPerPage, (currentPage + 1) * group_membershipsPerPage) as group_membership}
            {#if lockedFields == 1}
                <tr>
                    <td>{group_membership.id}</td>
                    <td>{group_membership.group_id}</td>
                    <td>{group_membership.user_id}</td>
                    <td>{group_membership.request}</td>
                    <td>{group_membership.member}</td>
                    <td>{group_membership.admin}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{group_membership.id}</td>
                    <td><input type="text" bind:value={group_membership.group_id} /></td>
                    <td><input type="text" bind:value={group_membership.user_id} /></td>
                    <td
                        ><select bind:value={group_membership.request}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td
                        ><select bind:value={group_membership.member}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td
                        ><select bind:value={group_membership.admin}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <button on:click={() => handleUpdate(group_membership)}>Submit</button>
                    <button on:click={() => deleteGroupMembership(group_membership)}>Delete</button>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>
<button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
{#if !lockedFields}
    <button on:click={handleUpdateAll}>Update All</button>
{/if}
<button on:click={prevPage} disabled={currentPage === 0}>Previous</button>
<button on:click={nextPage} disabled={(currentPage + 1) * group_membershipsPerPage >= group_memberships.length}>Next</button>
<div>
    Results Per Page
    <select bind:value={group_membershipsPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </select>
</div>