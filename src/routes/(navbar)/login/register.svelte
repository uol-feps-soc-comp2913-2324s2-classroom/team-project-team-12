<script>
    import { goto } from '$app/navigation';
    import { Input, Button, Label } from 'flowbite-svelte';

    let registerMessage = '';
    let usernameMessage = '';
    let emailMessage = '';

    let user = '';
    let password = '';
    let fname = '';
    let lname = '';
    let email = '';
    let confirmPassword = '';

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            registerMessage = 'Passwords do not match';
            return;
        }
        const formData = new FormData();
        formData.append('type', 'register');
        formData.append('username', user);
        formData.append('password', password);
        formData.append('firstname', fname);
        formData.append('lastname', lname);
        formData.append('email', email);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                registerMessage = result.message || 'Registration successful';
                // If registration is successful, navigate to the payments
                window.location = '/payments';
            } else if (result.status === 401) {
                usernameMessage = result.message || 'Username taken.';
            } else if (result.status === 402) {
                emailMessage = result.message || 'Account with email already exists.';
            } else if (result.statis === 403) {
                emailMessage = result.message || 'Invalid email address.';
            } else {
                registerMessage = 'Error registering user.';
            }
        } catch (error) {
            console.error('Error during login:', error);
            registerMessage = 'Internal Server Error';
        }
    };
</script>

<form class="flex flex-col space-y-3" name="register" method="post" on:submit|preventDefault={handleRegister}>
    <Input type="hidden" name="type" value="register" />
    <Label
        >First name:
        <Input type="text" bind:value={fname} name="firstname" required />
    </Label>
    <Label
        >Last name:
        <Input type="text" bind:value={lname} name="lastname" required />
    </Label>
    <Label>
        Username:
        <Input type="text" bind:value={user} name="username" required />
        {#if usernameMessage}
            <p>{usernameMessage}</p>
        {/if}
    </Label>
    <Label>
        Email address:
        <Input type="email" bind:value={email} name="email" required />
        {#if emailMessage}
            <p>{emailMessage}</p>
        {/if}
    </Label>
    <Label>
        Password:
        <Input type="password" bind:value={password} name="password" required />
    </Label>
    <Label>
        Confirm password:
        <Input type="password" bind:value={confirmPassword} required />
    </Label>
    <!-- if confirm password and password field don't match on submit -->
    {#if registerMessage}
        <p>{registerMessage}</p>
    {/if}
    <Button type="submit">Submit</Button>
</form>
