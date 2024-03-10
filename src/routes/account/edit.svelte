<script>
    import { goto } from '$app/navigation';
    let username = '';

    const editUsername = async() => {
        const formData = new FormData();
        formData.append('username', username);

        try {
            const response = await fetch('?/editusername', {
                method: 'POST',
                body: formData,
            });

            if(response.ok){
                // Reload the page
                goto(location.href, { replaceState: true });
            }
        }
        catch {

        }
    }
</script>

<p>Enter new username: </p>
<form on:submit={editUsername}>
    <input type="text" bind:value={username} />
    <input type="submit" />
</form>
