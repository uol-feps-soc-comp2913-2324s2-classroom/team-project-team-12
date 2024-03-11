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

            console.log('Checkpassword response:', matched.ok, matched.status);

            if (matched.ok && matched.status === 200) {
                formData.append('type', 'editpass');
                console.log('password matched');
                const response = await fetch('/account', {
                    method: 'POST',
                    body: formData,
                });

                console.log('Editpassword response:', response.ok, response.status);

                if (response.ok && response.status === 200) {
                    console.log('changed password');
                    // Password updated successfully, reload the page
                    // location.reload();
                } else {
                    // Handle error updating password
                    console.error('Error updating password');
                    error = 'Error updating password.';
                }
            } else {
                // Handle incorrect password
                console.log('password incorrect');
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