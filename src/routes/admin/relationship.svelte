<script lang="ts">
    import type { relationship } from '$lib/interfaces';

    export let relationships: relationship[];

    const handleUpdate = async (relationship: relationship) => {
        const formData = new FormData();
        formData.append('type', 'updateRelationship');
        formData.append('id', relationship.id.toString());
        if (relationship.user_id1) formData.append('user_id1', relationship.user_id1.toString());
        if (relationship.user_id2) formData.append('user_id2', relationship.user_id2.toString());
        if (relationship.friend_request) formData.append('friend_request', relationship.friend_request.toString());
        if (relationship.is_friend) formData.append('is_friend', relationship.is_friend.toString());
        if (relationship.is_blocked) formData.append('is_blocked', relationship.is_blocked.toString());

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
            <th>user_id1</th>
            <th>user_id2</th>
            <th>friend_request</th>
            <th>is_friend</th>
            <th>is_blocked</th>
        </tr>
    </thead>
    <tbody>
        {#each relationships as relationship}
            {#if lockedFields == 1}
                <tr>
                    <td>{relationship.id}</td>
                    <td>{relationship.user_id1}</td>
                    <td>{relationship.user_id2}</td>
                    <td>{relationship.friend_request}</td>
                    <td>{relationship.is_friend}</td>
                    <td>{relationship.is_blocked}</td>
                </tr>
            {/if}
            {#if lockedFields == 0}
                <tr>
                    <td>{relationship.id}</td>
                    <td><input type="text" bind:value={relationship.user_id1} /></td>
                    <td><input type="text" bind:value={relationship.user_id2} /></td>
                    <td><input type="text" bind:value={relationship.friend_request} /></td>
                    <td><input type="text" bind:value={relationship.is_friend} /></td>
                    <td><input type="text" bind:value={relationship.is_blocked} /></td>
                    <button on:click={() => handleUpdate(relationship)}>Submit</button>
                    <button on:click={() => deleteRelationship(relationship)}>Delete</button>
                </tr>
            {/if}
        {/each}
        <button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
    </tbody>
</table>
