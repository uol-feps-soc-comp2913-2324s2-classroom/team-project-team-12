<script lang="ts">
    import type { group } from '$lib/interfaces';

    export let prop: group[];
    let groups = prop;

    const handleUpdate = async (group: group) => {
        const formData = new FormData();
        formData.append('type', 'updateGroup');
        formData.append('id', group.id.toString());
        if (group.group_name) formData.append('group_name', group.group_name.toString());
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
            <th>id</th>
            <th>group_name</th>
            <th>creator</th>
            <th>publicity</th>
        </tr>
    </thead>
    <tbody>
        {#each groups as group}
            {#if lockedFields == 1}
                <tr>
                    <td>{group.id}</td>
                    <td>{group.group_name}</td>
                    <td>{group.creator}</td>
                    <td>{group.publicity}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{group.id}</td>
                    <td><input type="text" bind:value={group.group_name} /></td>
                    <td><input type="text" bind:value={group.creator} /></td>
                    <td><input type="text" bind:value={group.publicity} /></td>
                    <button on:click={() => handleUpdate(group)}>Submit</button>
                    <button on:click={() => deleteGroup(group)}>Delete</button>
                </tr>
            {/if}
        {/each}
        <button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
    </tbody>
</table>
