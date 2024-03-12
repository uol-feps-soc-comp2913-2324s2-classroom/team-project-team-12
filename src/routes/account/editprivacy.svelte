<script>
    let selectedPrivacy = '';
    const editPrivacy = async () => {
        const formData = new FormData();
        formData.append('type', 'privacy');
        formData.append('selected', selectedPrivacy);

        try {
            const response = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if(result.status === 200){
                // Reload the page
                location.reload();
            }
        }
        catch {

        }
    }
</script>

<p>Choose your account visibility: </p>
<form on:submit={editPrivacy}>
    <select bind:value={selectedPrivacy} id="privacy" name="privacy">
        <option value=0>Private</option>
        <option value=1>Friends Only</option>
        <option value=2>Public</option>
    </select>
    <input type="submit" />
</form>