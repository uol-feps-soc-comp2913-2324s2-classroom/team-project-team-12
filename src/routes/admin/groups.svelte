<script lang="ts">
    import type { group } from '$lib/interfaces';

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
            <th>id</th>
            <th>group_name</th>
            <th>creator</th>
            <th>publicity</th>
        </tr>
    </thead>
    <tbody>
        {#each groups.filter((g) => (g.id.toString().includes(searchTerm) || g.group_name.includes(searchTerm) || g.creator.toString().includes(searchTerm))).slice(currentPage * groupsPerPage, (currentPage + 1) * groupsPerPage) as group}
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
    </tbody>
</table>
<button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
{#if !lockedFields}
    <button on:click={handleUpdateAll}>Update All</button>
{/if}
<button on:click={prevPage} disabled={currentPage === 0}>Previous</button>
<button on:click={nextPage} disabled={(currentPage + 1) * groupsPerPage >= groups.length}>Next</button>
<div>
    Results Per Page
    <select bind:value={groupsPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </select>
</div>