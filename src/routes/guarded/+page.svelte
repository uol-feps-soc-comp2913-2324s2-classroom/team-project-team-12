<script lang="ts">
    import type { PageData }  from './$types';
  
    export let data: PageData;

    const typedData = data as { username?: string };

    const username = typedData ? typedData.username : null;
</script>
<h1>Welcome {username}</h1>