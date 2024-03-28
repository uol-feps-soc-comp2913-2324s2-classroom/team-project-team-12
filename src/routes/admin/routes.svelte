<script lang="ts">
    import type { route } from '$lib/interfaces';
    export let prop: route[];
    let routes = prop;

    let currentPage = 0;
    let routesPerPage = 10;

    let searchTerm = '';

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
        }
    };

    const handleUpdate = async (route: route) => {
        const formData = new FormData();
        formData.append('type', 'updateRoute');
        formData.append('id', route.id.toString());
        if (route.route_name) formData.append('route_name', route.route_name);
        if (route.created_on) formData.append('created_on', route.created_on.toString());
        if (route.length) formData.append('length', route.length.toString());
        if (route.approximate_completion_time)
            formData.append('approximate_completion_time', route.approximate_completion_time.toString());
        if (route.creator) formData.append('creator', route.creator.toString());
        if (route.publicity) formData.append('publicity', route.publicity.toString());

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
        for (const route of routes) {
            await handleUpdate(route);
        }
    };

    const deleteRoute = async (route: route) => {
        const formData = new FormData();
        formData.append('type', 'deleteRoute');
        formData.append('id', route.id.toString());

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
                routes = routes.filter((r) => r.id !== route.id);
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>
<input type="text" placeholder="Search..." bind:value={searchTerm} />
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Route Name</th>
            <th>Created On</th>
            <th>Length</th>
            <th>Approx. Completion Time</th>
            <th>Creator</th>
            <th>Publicity</th>
        </tr>
    </thead>
    <tbody>
        {#each routes.filter(route => route.id.toString().includes(searchTerm) || (route.route_name != null && route.route_name.includes(searchTerm)) || (route.creator != null && route.creator.toString().includes(searchTerm))).slice(currentPage * routesPerPage, (currentPage + 1) * routesPerPage) as route}
            {#if lockedFields}
                <tr>
                    <td>{route.id}</td>
                    <td>{route.route_name}</td>
                    <td>{route.created_on}</td>
                    <td>{route.length}</td>
                    <td>{route.approximate_completion_time}</td>
                    <td>{route.creator}</td>
                    <td>{route.publicity}</td>
                </tr>
            {/if}
            {#if !lockedFields}
                <tr>
                    <td>{route.id}</td>
                    <td><input type="text" bind:value={route.route_name} /></td>
                    <td><input type="text" bind:value={route.created_on} /></td>
                    <td><input type="text" bind:value={route.length} /></td>
                    <td><input type="text" bind:value={route.approximate_completion_time} /></td>
                    <td><input type="text" bind:value={route.creator} /></td>
                    <td><input type="text" bind:value={route.publicity} /></td>
                    <button on:click={() => handleUpdate(route)}>Submit</button>
                    <button on:click={() => deleteRoute(route)}>Delete</button>
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
<button on:click={nextPage} disabled={(currentPage + 1) * routesPerPage >= routes.length}>Next</button>
<div>
    Results Per Page
    <select bind:value={routesPerPage} on:change={() => currentPage = 0}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </select>
</div>