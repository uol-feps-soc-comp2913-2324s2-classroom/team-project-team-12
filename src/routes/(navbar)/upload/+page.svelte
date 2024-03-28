<script lang="ts">
    import { Button, Label, Fileupload, Select } from 'flowbite-svelte';

    let privacySettings = [
        { value: 1, name: 'Public' },
        { value: 2, name: 'Private' },
        { value: 3, name: 'Friends Only' },
    ];
</script>

<main>
    <form class="m-auto md:w-1/2 w-full px-12" method="post" enctype="multipart/form-data">
        <div>
            <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
                Upload GPS Data
            </div>
            <Label>
                GPS data:
                <Fileupload class="my-2" multiple required name="file" />
            </Label>
            <Label>
                Privacy:
                <Select class="my-2" items={privacySettings} name="privacy" />
            </Label>
        </div>

        <Button class="mt-4" type="submit">Submit</Button>
    </form>
</main>
