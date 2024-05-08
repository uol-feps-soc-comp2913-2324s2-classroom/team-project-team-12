<script lang="ts">
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    export let notMemberOfGroups: { id: number; name: string }[] = [];
    export let requested: { id: number; user_id: number; group_id: number; groups: { name: string } }[] = [];

    export let searchTerm = '';
    let currentPage = 1;
    const pageSize = 5;

    const joinGroup = async (group: { id: number; name: string }) => {
        const formData = new FormData();
        formData.append('type', 'joinGroup');
        formData.append('id', group.id.toString());

        try {
            const response = await fetch('/groups', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            let actualResult = result.data;
            actualResult = JSON.parse(actualResult);

            if (actualResult[1] == 200) {
                console.log(result.message || 'Requested group successfully');
                notMemberOfGroups = notMemberOfGroups.filter((g) => g.id !== group.id);
            } else {
                console.error(actualResult[3] || 'Failed to request group');
            }
        } catch (error) {
            console.error('Error requesting group:', error);
        }
    };

    const cancelGroupRequest = async (group: {
        id: number;
        user_id: number;
        group_id: number;
        groups: { name: string };
    }) => {
        const formData = new FormData();
        formData.append('type', 'cancelRequest');
        formData.append('id', group.id.toString());

        try {
            const response = await fetch('/groups', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            let actualResult = result.data;
            actualResult = JSON.parse(actualResult);

            if (actualResult[1] == 200) {
                console.log('Canceled group request successfully');
                requested = requested.filter((g) => g.id !== group.id);
            } else {
                console.error(actualResult[3] || 'Failed to cancel group request');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    $: filteredGroups = notMemberOfGroups.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    $: filteredRequested = requested.filter((group) =>
        group.groups.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    $: {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        filteredGroups = notMemberOfGroups.slice(startIndex, endIndex);
        filteredGroups = filteredGroups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

        filteredRequested = requested.slice(startIndex, endIndex);
        filteredRequested = filteredRequested.filter((group) =>
            group.groups.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }
</script>

<Listgroup active class="w-full md:w-80">
    <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Groups</h3>
    {#each filteredGroups as group}
        <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
            <a
                rel="external"
                href="../group/{group.name}"
                class="flex items-center font-semibold text-gray-900 dark:text-white"
            >
                <span>{group.name.length > 15 ? `${group.name.slice(0, 15)}...` : group.name}</span>
            </a>
            <button
                on:click={() => joinGroup(group)}
                class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg"
            >
                Join
            </button>
        </ListgroupItem>
    {/each}

    {#if notMemberOfGroups.length > pageSize}
        <!-- Pagination buttons container with padding -->
        <div class="flex justify-center mt-4 py-2">
            <!-- Previous Page Button -->
            <button
                class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                disabled={currentPage === 1}
                on:click={() => (currentPage -= 1)}
            >
                Previous
            </button>

            <!-- First Page Button -->
            {#if currentPage != 1}
                <button
                    class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                    on:click={() => (currentPage = 1)}
                >
                    1
                </button>
            {/if}

            <!-- Current Page Button -->
            <button
                class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
                disabled
            >
                {currentPage}
            </button>

            <!-- Last Page Button -->
            {#if currentPage < Math.ceil(notMemberOfGroups.length / pageSize)}
                <button
                    class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                    on:click={() => (currentPage = Math.ceil(notMemberOfGroups.length / pageSize))}
                >
                    {Math.ceil(notMemberOfGroups.length / pageSize)}
                </button>
            {/if}

            <!-- Next Page Button -->
            <button
                class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                disabled={currentPage === Math.ceil(notMemberOfGroups.length / pageSize)}
                on:click={() => (currentPage += 1)}
            >
                Next
            </button>
        </div>
    {/if}
</Listgroup>

{#if requested.length > 0}
    <Listgroup active class="w-full md:w-80 mt-4">
        <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Requested</h3>
        {#each filteredRequested as group}
            <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
                <a
                    rel="external"
                    href="../group/{group.groups.name}"
                    class="flex items-center font-semibold text-gray-900 dark:text-white"
                >
                    <span>{group.groups.name}</span>
                </a>
                <button
                    on:click={() => cancelGroupRequest(group)}
                    class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg"
                >
                    Cancel
                </button>
            </ListgroupItem>
        {/each}

        {#if requested.length > pageSize}
            <!-- Pagination buttons container with padding -->
            <div class="flex justify-center mt-4 py-2">
                <!-- Previous Page Button -->
                <button
                    class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                    disabled={currentPage === 1}
                    on:click={() => (currentPage -= 1)}
                >
                    Previous
                </button>

                <!-- First Page Button -->
                {#if currentPage != 1}
                    <button
                        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                        on:click={() => (currentPage = 1)}
                    >
                        1
                    </button>
                {/if}

                <!-- Current Page Button -->
                <button
                    class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
                    disabled
                >
                    {currentPage}
                </button>

                <!-- Last Page Button -->
                {#if currentPage < Math.ceil(requested.length / pageSize)}
                    <button
                        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                        on:click={() => (currentPage = Math.ceil(requested.length / pageSize))}
                    >
                        {Math.ceil(requested.length / pageSize)}
                    </button>
                {/if}

                <!-- Next Page Button -->
                <button
                    class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                    disabled={currentPage === Math.ceil(requested.length / pageSize)}
                    on:click={() => (currentPage += 1)}
                >
                    Next
                </button>
            </div>
        {/if}
    </Listgroup>
{/if}
