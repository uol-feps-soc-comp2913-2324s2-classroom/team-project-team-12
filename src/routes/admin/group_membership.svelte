<script lang="ts">
    import type { group_membership } from '$lib/interfaces';

    export let group_memberships: group_membership[];

    const handleUpdate = async (group_membership: group_membership) => {
        const formData = new FormData();
        formData.append('type', 'updateGroupMembership');
        formData.append('id', group_membership.id.toString());
        if (group_membership.group_id) formData.append('group_id', group_membership.group_id.toString());
        if (group_membership.user_id) formData.append('user_id', group_membership.user_id.toString());
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

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Group ID</th>
            <th>User ID</th>
            <th>Admin</th>
        </tr>
    </thead>
    <tbody>
        {#each group_memberships as group_membership}
            {#if lockedFields == 1}
                <tr>
                    <td>{group_membership.id}</td>
                    <td>{group_membership.group_id}</td>
                    <td>{group_membership.user_id}</td>
                    <td>{group_membership.admin}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{group_membership.id}</td>
                    <td><input type="text" bind:value={group_membership.group_id} /></td>
                    <td><input type="text" bind:value={group_membership.user_id} /></td>
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
        <button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
    </tbody>
</table>
