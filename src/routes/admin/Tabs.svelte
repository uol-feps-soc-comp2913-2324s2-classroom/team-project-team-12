<script lang="ts">
  export let itemTuples: any =  [];
  export let activeTabValue = 1;
  
  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul>
{#each itemTuples as item}
  <li class={activeTabValue === item.value ? 'active' : ''}>
      <span on:click={handleClick(item.value)}>{item.label}</span>
  </li>
{/each}
</ul>
{#each itemTuples as item}
  {#if activeTabValue == item.value}
  <div class="box">
      <svelte:component this={item.component} prop={item.prop}/>
  </div>
  {/if}
{/each}
