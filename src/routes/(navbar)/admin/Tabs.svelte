<script lang="ts">
    import { Tabs, TabItem } from 'flowbite-svelte';
    export let itemTuples: any = [];
    export let activeTabValue = 1;

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<Tabs>
    {#each itemTuples as item}
        <TabItem title={item.label}>
            <svelte:component this={item.component} prop={item.prop} />
        </TabItem>
    {/each}
</Tabs>
