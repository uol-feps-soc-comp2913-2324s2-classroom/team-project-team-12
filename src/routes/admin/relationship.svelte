<script lang="ts">
    import type { relationship } from '$lib/interfaces';

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

<input type="text" bind:value={searchTerm} placeholder="Search..." />

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
        {#each relationships.filter(((r) => r.user_id1.toString().includes(searchTerm) || r.user_id2.toString().includes(searchTerm))).slice(currentPage * relationshipsPerPage, (currentPage + 1) * relationshipsPerPage) as relationship}
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
                    <td>
                        <select bind:value={relationship.friend_request}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td>
                        <select bind:value={relationship.is_friend}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td>
                        <select bind:value={relationship.is_blocked}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <button on:click={() => handleUpdate(relationship)}>Submit</button>
                    <button on:click={() => deleteRelationship(relationship)}>Delete</button>
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
<button on:click={nextPage} disabled={(currentPage + 1) * relationshipsPerPage >= relationships.length}>Next</button>
<div>
    Results Per Page
    <select bind:value={relationshipsPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </select>
</div>
