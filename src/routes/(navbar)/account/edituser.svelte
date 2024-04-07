<script>
    // @ts-nocheck
    import { Modal, Button, Input } from 'flowbite-svelte';
    let popup = false;
    let username = '';
    let errorMessage = '';

    const editUsername = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('type', 'editusername');

        try {
            const response = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            let result = await response.json();

            if(result.status === 401){
                errorMessage = 'Username already exists.'
            }else if(result.status === 200){
                location.reload();
            }
        }
        catch {

        }
    }
</script>

<Button color="light" on:click={() => (popup = true)}>Edit</Button>

<Modal title="Edit Username" bind:open={popup} autoclose={false}>
    <form method="post" on:submit={editUsername}>
        <Input  
            bind:value={username}
            type = "text"
            name = "newuser"
            required
        />
        {#if errorMessage}
            <p>{errorMessage}</p>
        {/if}
        <Button class="mt-4" type="submit">Submit</Button>
    </form>
</Modal>
