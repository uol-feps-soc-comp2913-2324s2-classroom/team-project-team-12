<script lang="ts">
    import type { group_route } from '$lib/interfaces';
    export let prop: group_route[];
    let group_routes = prop;
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
            <th>Route ID</th>
            <th>Priority</th>
        </tr>
    </thead>
    <tbody>
        {#each group_routes as group_route}
            {#if lockedFields == 1}
                <tr>
                    <td>{group_route.id}</td>
                    <td>{group_route.group_id}</td>
                    <td>{group_route.route_id}</td>
                    <td>{group_route.priority}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{group_route.id}</td>
                    <td><input type="text" bind:value={group_route.group_id} /></td>
                    <td><input type="text" bind:value={group_route.route_id} /></td>
                    <td><input type="text" bind:value={group_route.priority} /></td>
                    <button on:click={() => handleUpdate(group_route)}>Submit</button>
                    <button on:click={() => deleteGroupRoute(group_route)}>Delete</button>
                </tr>
            {/if}
        {/each}
        <button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
    </tbody>
</table>
