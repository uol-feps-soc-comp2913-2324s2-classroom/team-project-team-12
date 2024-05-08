<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { Button, Label, Fileupload, Select, Alert } from 'flowbite-svelte';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';

    let privacySettings = [
        { value: 2, name: 'Public' },
        { value: 0, name: 'Private' },
        { value: 1, name: 'Friends Only' },
    ];

    onMount(() => {
        if ($page.form && $page.form.success) goto('/map');
    });
</script>

<main>
    <form class="m-auto md:w-1/2 w-full px-12" method="post" enctype="multipart/form-data">
        <div>
            <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
                Upload GPX Data
            </div>
            <Label>
                GPX data:
                <Fileupload class="my-2" multiple required name="file" />
            </Label>
            <Label>
                Privacy:
                <Select class="my-2" items={privacySettings} name="privacy" />
            </Label>
        </div>

        <Button class="mt-4" type="submit">Submit</Button>
        <Alert color="none" class="mt-8 dark:bg-gray-700 bg-gray-200 text-black dark:text-white">
            <InfoCircleSolid slot="icon" class="w-5 h-5" />
            <span class="font-medium">Before Uploading!</span>
            Verify that your file uses GPX route (<code>&lt;rte/&gt;</code>) tags and <b>not</b> track (<code
                >&lt;trk/&gt;</code
            >) tags, as Journeys only supports route data. Ensure file compatibility by using our
            <a class="text-blue-600 dark:text-blue-400" href="/download">awesome export feature</a>.
        </Alert>
    </form>
</main>
