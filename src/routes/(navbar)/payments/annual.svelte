<script lang="ts">
    import { Card, P, Heading, Button, Badge, GradientButton} from 'flowbite-svelte';
    import { CheckCircleSolid } from 'flowbite-svelte-icons';
    let registerMessage = ""
    
    export let user;
    
    const handleUpdate = async () => {
        console.log('update');
        try {
            const response = await fetch('?/update', {
                method: 'POST',
                body: '2',
            });
            console.log('response:', response);
            window.location.href = '/payments/checkout';
        } catch (error) {
            console.error('Error during update:', error);
            registerMessage = 'Internal Server Error';
        }
    
    }
</script>

<div>
        <Card padding="xl">
            <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Yearly Plan
                <Badge class="text-2xl font-semibold ms-2">PRO</Badge>
            </h5>
            <div class="flex items-baseline text-gray-900 dark:text-white">
            <span class="text-3xl font-semibold">£</span>
            <span class="text-5xl font-extrabold tracking-tight">100</span>
            <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/year</span>
            </div>
            <ul class="my-7 space-y-4">
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Upload and store GPS route data. </span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Display GPS route data on a map. </span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Switch payment type whenever. </span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Ability to add friends and create groups.</span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">View shared data on a map.</span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse">
                    <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                    <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Save over <b>£50!</b></span>
                </li>
            </ul>
            <GradientButton class="w-full" color="pinkToOrange" disabled={user.membership_type == 2}  on:click={handleUpdate}>
            {#if user.membership_type == 2} Your Plan {:else} Choose Plan {/if} 
        </GradientButton>
        </Card>
</div>
