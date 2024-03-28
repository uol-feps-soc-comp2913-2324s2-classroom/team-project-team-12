<script>
    let password = '';
    let oldPassword = '';
    let error='';

    const passwordChange = async () => {
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
                error = 'Incorrect password.';
            }
        } catch (error) {
            // Handle internal server error
            console.error('Internal Server Error');
            error = 'Internal Server Error.';
        }
    }
</script>

<p>Change Password </p>
{#if error}
    <p style="color: red;">{error}</p>
{/if}
<form on:submit|preventDefault={passwordChange}>
    <input type="hidden" name="type" value="login" />
    <label for="oldpass">Enter current password: </label>
    <br>
    <input type="password" name="oldpass" bind:value={oldPassword} />
    <br>
    <label for="newpass">Enter new password: </label>
    <br>
    <input type="password" name="newpass" bind:value={password} />
    <input type="submit" />
</form>