<script lang="ts">
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import type { user } from '$lib/interfaces'
    import { onMount } from "svelte";
    import Data from './data.svelte';
    import { Card } from 'flowbite-svelte';
    
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

<Card class="green" style="margin: 0 auto; margin-top:20px;">
    <div class="header">
        <div class="name">
            <h1 class="font-semibold text-gray-900 dark:text-white">@{user?.username}</h1>
        </div>
        <div class="picture">
            <img src={userPictureUrl} alt="" />
        </div>
    </div>
    <div class="data">
        <Data {user} />
    </div>
</Card>

<style>

    .header {
        margin: 30px;
        justify-content: space-between;
        display: flex;
    }

    .name, .picture {
        position: relative;
    }

    .name {
        margin-top: 20px;
    }

    .picture {
        display: inline-block; 
        width: 5em; 
        height: 5em; 
        overflow: hidden; 
        border-radius: 50%; 
        margin-bottom: 20px;
        border: 1px solid #ccc;
    }

    .picture img { 
        width: auto; 
        height: 100%; 
    }

    .data {
        margin: 20px;
    }

</style>