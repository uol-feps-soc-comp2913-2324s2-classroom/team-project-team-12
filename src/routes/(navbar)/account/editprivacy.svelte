<script>
    import { Button, Select, Modal } from 'flowbite-svelte';

    let popup=false;
    let selectedPrivacy = '';
    let errorMessage = '';

    let privacySettings = [
        {value: 0, name: "Private"},
        {value: 1, name: "Friends Only"},
        {value: 2, name: "Public"},
    ]

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

<Button color="light" on:click={() => (popup = true)}>Edit</Button>

<Modal title="Choose Account Visibility" bind:open={popup} autoclose={false}>
    <form method="post" on:submit={editPrivacy}>
        <Select class="my-2" items={privacySettings} name="period" bind:value={selectedPrivacy}/>
        {#if errorMessage}
            <p>{errorMessage}</p>
        {/if}
        <Button class="mt-4" type="submit">Submit</Button>
    </form>
</Modal>