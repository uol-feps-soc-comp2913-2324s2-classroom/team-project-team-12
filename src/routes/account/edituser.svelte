<script>
    import { goto } from '$app/navigation';
    let username = '';

    const editUsername = async() => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'editusername');

        try {
            const response = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            if(response.ok){
                // Reload the page
                location.reload();
            }
        }
        catch {

        }
    }
</script>

<p>Enter new username: </p>
<form on:submit={editUsername}>
    <input type="text" name="newuser" bind:value={username} />
    <input type="submit" />
</form>
