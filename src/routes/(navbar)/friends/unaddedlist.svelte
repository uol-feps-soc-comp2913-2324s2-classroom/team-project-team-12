<script lang="ts">
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    import { CaretLeftOutline, CaretLeftSolid, CaretRightOutline, CaretRightSolid } from 'flowbite-svelte-icons';
    export let people: { id: number; name: string; first_name: string; last_name: string }[] = [];
    export let requested: { id: number; name: string }[] = [];
    export let searchTerm = '';
    let currentPage = 1;
    const pageSize = 8;

    const addFriend = async (person: { id: number; name: string }) => {
        const formData = new FormData();
        formData.append('type', 'addFriend');
        formData.append('id', person.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            let actualResult = result.data;
            actualResult = JSON.parse(actualResult);

            if (actualResult[1] == 200) {
                console.log(result.message || 'Sent friend request');
                people = people.filter((p) => p.id !== person.id);
                requested.push(person);
            } else {
                console.error(actualResult[3] || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const cancelRequest = async (requestedPerson: { id: number; name: string }) => {
        const formData = new FormData();
        formData.append('type', 'cancelRequest');
        formData.append('id', requestedPerson.id.toString());

        try {
            const response = await fetch('/friends', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            let actualResult = result.data;
            actualResult = JSON.parse(actualResult);
            console.log(result.message || 'Cancelled friend request');
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
        people.push({ ...requestedPerson, first_name: 'NaN', last_name: 'NaN' });
        requested = requested.filter((p) => p.id !== requestedPerson.id);
    };
    $: filteredPeople = people.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

    $: filteredRequested = requested.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

    $: {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        filteredPeople = people.slice(startIndex, endIndex);
        filteredPeople = filteredPeople.filter((person) =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        filteredRequested = requested.slice(startIndex, endIndex);
        filteredRequested = filteredRequested.filter((request) =>
            request.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    import { getDefaultProfilePictureUrl } from './pfp.js';
</script>

<div class="box">
    {#if people.length > 0}
        <Listgroup active class="w-full h-auto md:w-80">
            <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">People</h3>
            {#each filteredPeople as person}
                <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
                    <a
                        rel="external"
                        href="../profile/{person.name}"
                        class="flex items-center font-semibold text-gray-900 dark:text-white"
                    >
                        <Avatar src={getDefaultProfilePictureUrl(person)} size="xs" style="margin-right: 8px;" />
                        <span>{person.name.length > 15 ? `${person.name.slice(0, 15)}...` : person.name}</span>
                    </a>
                    <button
                        on:click={() => addFriend(person)}
                        class="flex items-center p-1 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg"
                    >
                        Add
                    </button>
                </ListgroupItem>
            {/each}

            {#if people.length > pageSize}
                <!-- Pagination buttons container with padding -->
                <div class="flex justify-center mt-4 py-2">
                    <!-- First Page Button -->
                    {#if currentPage != 1}
                        <button
                            class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                            on:click={() => (currentPage = 1)}
                        >
                            <CaretLeftSolid class="w-4 h-4" />
                        </button>
                    {/if}

                    <!-- Previous Page Button -->
                    {#if currentPage > 1}
                        <button
                            class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                            on:click={() => (currentPage -= 1)}
                        >
                            <CaretLeftOutline class="w-4 h-4" />
                        </button>
                    {/if}

                    <!-- Current Page Button -->
                    <button
                        class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-blue-400 hover:border-gray-400 border-gray-400"
                        disabled
                    >
                        {currentPage}
                    </button>

                    <!-- Next Page Button -->
                    {#if currentPage < Math.ceil(people.length / pageSize)}
                        <button
                            class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                            on:click={() => (currentPage += 1)}
                        >
                            <CaretRightOutline class="w-4 h-4" />
                        </button>
                    {/if}

                    <!-- Last Page Button -->
                    {#if currentPage < Math.ceil(people.length / pageSize) && Math.ceil(people.length / pageSize) >= 3}
                        <button
                            class="px-3 py-1 mx-1 text-sm font-medium text-gray-900 bg-gray-200 border rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-500 hover:border-gray-400"
                            on:click={() => (currentPage = Math.ceil(people.length / pageSize))}
                        >
                            <CaretRightSolid class="w-4 h-4" />
                        </button>
                    {/if}
                </div>
            {/if}
        </Listgroup>
    {/if}
    {#if requested.length > 0}
        <Listgroup active class="w-full h-auto md:w-80 mt-4">
            <h3 class="p-1 text-center text-xl font-medium text-gray-900 dark:text-white">Requested</h3>
            {#each filteredRequested as person}
                <ListgroupItem class="flex items-center justify-between text-base font-semibold gap-2">
                    <a
                        rel="external"
                        href="../profile/{person.name}"
                        class="flex items-center font-semibold text-gray-900 dark:text-white"
                    >
                        <Avatar src={getDefaultProfilePictureUrl(person)} size="xs" style="margin-right: 8px;" />
                        <span>{person.name.length > 15 ? `${person.name.slice(0, 15)}...` : person.name}</span>
                    </a>
                    <button
                        on:click={() => cancelRequest(person)}
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
</div>

<style>
    .box {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: top;
    }
</style>
