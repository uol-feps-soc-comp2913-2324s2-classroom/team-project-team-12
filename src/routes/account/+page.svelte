<script lang="ts">
    // @ts-nocheck
    import Data from './data.svelte';

    export let data;
    export const user = data.curUser;

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

    const userPictureUrl = getDefaultProfilePictureUrl(user);

</script>

<div class="account-info">
    <div class="header">
        <div class="name">
            <h1>@{user?.username}</h1>
        </div>
        <div class="picture">
            <img src={userPictureUrl} alt="" />
        </div>
    </div>
    <div class="data">
        <Data {user} />
    </div>
</div>

<style>
    .account-info {
        height: 650px;
        width: 500px;
        margin: auto auto;
        background-color: white;
        box-shadow: 8px 8px 20px #a8b6ae;
        border-radius: 50px;
        position: relative;
        overflow: hidden;
    }

    .header {
        margin: 30px;
        justify-content: space-between;
        display: flex;
    }

    .name, .picture {
        position: relative;
    }

    .picture {
        display: inline-block; 
        width: 8vh; 
        height: 8vh; 
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
        margin: 30px;
    }

</style>