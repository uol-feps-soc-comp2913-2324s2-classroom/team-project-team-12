<script lang="ts">
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import type { user } from '$lib/interfaces'
    import { onMount } from "svelte";
    import Data from './data.svelte';
    import { Card, Avatar } from 'flowbite-svelte';
    
    export let user: user;
    export let data;
    let userPictureUrl: string;

    onMount(() => {
        // Check if data is invalid and redirect if necessary
        if (data.invalid) {
            goto('/');
        }
    });

    if(data.curUser){
        user = data.curUser;
        userPictureUrl = getDefaultProfilePictureUrl(user);
    }

    function hashUserId(userId) {
        return (userId * 2654435761) % Math.pow(2, 32); 
    }

    function getRandomColor(userId) {
        const hashedUserId = hashUserId(userId);
        const color = hashedUserId.toString(16).slice(-6); // Convert to hexadecimal and take the last 6 characters
        return color;
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    function getDefaultProfilePictureUrl(user) {
        const initials = getInitials(user.first_name, user.last_name);
        const color = getRandomColor(user.id);
        const imageSize = 200; // Adjust this size according to your requirement
        const imageUrl = `https://ui-avatars.com/api/?name=${initials}&background=${color}&size=${imageSize}`;
        return imageUrl;
    }

</script>

<Card style="margin: 0 auto; margin-top:20px;">
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