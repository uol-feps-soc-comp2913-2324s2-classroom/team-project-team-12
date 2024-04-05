<script>
    // @ts-nocheck
    import { Button, Modal, Input, Label } from 'flowbite-svelte';
    let popup=false;
    let password = '';
    let oldPassword = '';
    let error='';
    let incorrectError = '';

    const passwordChange = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('oldpass', oldPassword);
        formData.append('newpass', password);
        formData.append('type', 'checkpass');

        try {
            // check current password is correct
            const matched = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            const result = await matched.json();

            if (result.status === 200) {
                const formDataEditPass = new FormData();
                formDataEditPass.append('newpass', password);
                formDataEditPass.append('type', 'editpass');
                console.log("editing password");
                const response = await fetch('/account', {
                    method: 'POST',
                    body: formDataEditPass,
                });

                const result = await response.json();

                if (result.status === 200) {
                    // Password updated successfully, reload the page
                    location.reload();
                } else {
                    // Handle error updating password
                    console.error('Error updating password');
                    error = 'Error updating password.';
                }
            } else {
                // Handle incorrect password
                incorrectError = 'Incorrect password.';
            }
        } catch (error) {
            // Handle internal server error
            console.error('Internal Server Error');
            error = 'Internal Server Error.';
        }
    }
</script>

<Button color="light" on:click={() => (popup = true)}>Edit</Button>

<Modal title="Change Password" bind:open={popup} autoclose={false}>
    <form method="post" on:submit={passwordChange}>
        <Label>Enter current password</Label>
        <Input  
            bind:value={oldPassword}
            type = "password"
            name = "oldpass"
            required
        />
        {#if incorrectError}
            <p>{incorrectError}</p>
        {/if}
        <Label>Enter new password</Label>
        <Input  
            bind:value={password}
            type = "password"
            name = "newpass"
            required
        />
        {#if error}
            <p>{error}</p>
        {/if}
        <Button class="mt-4" type="submit">Submit</Button>
    </form>
</Modal>