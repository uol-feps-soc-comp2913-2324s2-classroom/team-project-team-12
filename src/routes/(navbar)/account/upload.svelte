<script lang="ts">
    // @ts-nocheck
    import {Label, Button, Fileupload, Listgroup, ListgroupItem} from 'flowbite-svelte';

    let files;

    const uploadProfilePic = async() => {
        const formData = new FormData();
        formData.append('file', 's');
        formData.append('type', 'upload');

        try {
            const response = await fetch('/account', {
                method: 'POST',
                body: formData,
            });

            let result = await response.json();

        }
        catch {

        }
    }
</script>

<form class="flex flex-col space-y-6" method="post" on:submit={uploadProfilePic}>
    <Fileupload class="my-2" required accept="image/*" bind:files/>
    <Button type="submit">Upload</Button>
</form>
