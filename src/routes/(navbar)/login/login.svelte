<script>
    let username = '';
    let password = '';
    import { goto } from '$app/navigation';
    import { Button, Input, Label } from 'flowbite-svelte';

    let loginMessage = '';
    let error = '';

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('type', 'login');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                console.log(result.message || 'Login successful');
                goto('/map');
            } else {
                error = 'Incorrect username or password';
            }

        } catch (error) {
            console.error('Error during login:', error);
            loginMessage = 'Internal Server Error';
        }
    };
</script>

<form class="flex flex-col space-y-6" name="login" method="post" on:submit|preventDefault={handleLogin}>
    <Input type="hidden" name="type" value="login"/>
    <Label>Username: 
        <Input  
            bind:value={username}
            type = "text"
            name = "username"
            required
        />
    </Label>
    <Label>Password:
        <Input
            bind:value={password}
            type="password"
            name = "password"
            required
        />
    </Label>
    {#if error}
        <p>{error}</p>
    {/if}
    <Button class="mt-4" type="submit">Submit</Button>
</form>


