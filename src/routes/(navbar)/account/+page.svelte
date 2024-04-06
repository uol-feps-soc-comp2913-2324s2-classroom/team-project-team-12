<script lang="ts">
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import type { user } from '$lib/interfaces'
    import { onMount } from "svelte";
    import Data from './data.svelte';
    import { Card, Avatar } from 'flowbite-svelte';
    
    export let user: user;
    export let data;

    onMount(() => {
        // Check if data is invalid and redirect if necessary
        if (data.invalid) {
            goto('/');
        }
    });

    if(data.curUser){
        user = data.curUser;
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

</script>

<Card class="bg-gray-100 dark:bg-gray-700" style="margin: 0 auto; margin-top:20px;">
    <div class="header">
        <div class="flex flex-col items-center pb-4">
            <Avatar size="lg">{getInitials(user.first_name,user.last_name)}</Avatar>
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">@{user.username}</span>
        </div>
    </div>
    <div class="data">
        <Data {user} />
    </div>
</Card>

<style>

    .data {
        margin: 5px;
    }

</style>