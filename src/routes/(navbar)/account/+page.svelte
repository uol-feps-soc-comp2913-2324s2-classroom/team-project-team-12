<script lang="ts">
    // @ts-nocheck
    import { goto } from '$app/navigation';
    import type { user } from '$lib/interfaces';
    import { onMount } from 'svelte';
    import Data from './data.svelte';
    import { Card, Avatar, Button, Modal, Tooltip } from 'flowbite-svelte';
    import { ExclamationCircleOutline, PenOutline } from 'flowbite-svelte-icons';

    export let user: user;
    export let data;

    let popup = false;
    let edit = false;

    onMount(() => {
        // Check if data is invalid and redirect if necessary
        if (data.invalid) {
            goto('/');
        }
    });

    if (data.curUser) {
        user = data.curUser;
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    const deleteAccount = async () => {
        const formData = new FormData();
        formData.append('type', 'delete');

        try {
            const response = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                goto('/');
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
        }
    };
</script>

<div class="main-container">
    <Card class="bg-gray-100 dark:bg-gray-700" style="margin: 0 auto; margin-top:20px;">
        <div class="header">
            <div class="flex flex-col items-center space-y-1 pb-4">
                <div class="profilepic">
                    <div class="icon">
                        <Avatar border size="lg">{getInitials(user.first_name, user.last_name)}</Avatar>
                    </div>
                </div>
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {user.first_name}
                    {user.last_name}
                </h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">@{user.username}</span>
            </div>
        </div>
        <div class="data">
            <Data {user} />
        </div>

        <Button on:click={() => (popup = true)} outline color="red">Delete Account</Button>
        <Modal bind:open={popup} size="xs" autoclose="false">
            <div class="text-center">
                <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete your account?
                </h3>
                <Button on:click={deleteAccount} color="red" class="me-2">Yes, I'm sure</Button>
                <Button on:click={() => (popup = false)} color="alternative">No, cancel</Button>
            </div>
        </Modal>
    </Card>
</div>

<style>
    .main-container {
        width: 100%;
        height: 90vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .data {
        margin: 5px;
    }

    .profilepic {
        position: relative;
    }
</style>
