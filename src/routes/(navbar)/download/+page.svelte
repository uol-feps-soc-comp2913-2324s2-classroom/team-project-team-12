<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { Button, Label, Select } from 'flowbite-svelte';
    import { deserialize } from '$app/forms';

    let period: any;

    let timePeriodSettings = [
        { value: 1, name: '1 month' },
        { value: 3, name: '3 months' },
        { value: 6, name: '6 months' },
        { value: 12, name: '12 months' },
    ];

    const downloadData = async () => {
        // set the period to download data from
        let currentDate = new Date();

        let startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - period);

        const formData = new FormData();
        formData.append('start', startDate.toDateString());

        try {
            const response = await fetch('/download', {
                method: 'POST',
                body: formData,
            });

            const responseContent = deserialize(await response.text()).data.body;

            const a = document.createElement('a');
            a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(responseContent);
            a.download = 'data.gpx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {}
    };

    onMount(() => {
        if ($page.form && $page.form.success) goto('/map');
    });
</script>

<main>
    <form class="m-auto md:w-1/2 w-full px-12" method="post" enctype="multipart/form-data">
        <div>
            <div class="self-center whitespace-nowrap text-2xl my-5 font-semibold text-gray-900 dark:text-white">
                Download GPS Data
            </div>
            <Label>
                Choose time period:
                <Select class="my-2" items={timePeriodSettings} name="period" bind:value={period} />
            </Label>
        </div>

        <Button class="mt-4" on:click={downloadData}>Submit</Button>
    </form>
</main>
