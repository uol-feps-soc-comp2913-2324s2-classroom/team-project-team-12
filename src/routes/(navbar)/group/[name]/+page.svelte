<script lang="ts">
    // @ts-nocheck
    export let data;
    export const group = data.group;
    export const members = data.members;
    export const creator = data.creator;
    export const memberCount = data.memberCount;

    import { Button, Card, Tabs, TabItem, Listgroup, Avatar, Indicator } from 'flowbite-svelte';

    function getInitials(fullName) {
        // Split the full name into an array of words
        const nameArray = fullName.split(" ");
        
        // Initialize an empty string to store initials
        let initials = "";

        // Loop through each word in the name array
        nameArray.forEach(word => {
            // Add the first character of each word to the initials string
            initials += word.charAt(0).toUpperCase();
        });

        return initials;
    }

</script>
 
<style>
    body {
        overflow: hidden; /* Hide scrollbars */
    }    
    
    .main-container {
        height: 80vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>

<body>
    <div class="main-container">
        <Card padding="lg" size="lg">
            <div class="flex flex-col items-center pb-4">
                <Avatar size="lg">{getInitials(group.name)}</Avatar>
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{group.name}</h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">This group was created by @{creator.username}.</span>
            </div>
            <Tabs style="full" tabStype="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700">
                <TabItem class="w-full" open>
                    <span slot="title">Members</span>
                    <Listgroup items={members} let:item class="border-0 dark:!bg-transparent">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            {#if item.username == creator.username}
                            <Avatar border class="ring-amber-400 dark:ring-amber-300">{getInitials(item.first_name + " " + item.last_name)}</Avatar>
                            {:else}
                            <Avatar>{getInitials(item.first_name + " " + item.last_name)}</Avatar>
                            {/if}
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {item.first_name} {item.last_name}
                                </p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                    @{item.username}
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <Button color="light" rel="external" href="../profile/{item.username}">View Profile</Button>
                            </div>
                        </div>
                    </Listgroup>
                </TabItem>
            </Tabs>
        </Card>
    </div>
</body>