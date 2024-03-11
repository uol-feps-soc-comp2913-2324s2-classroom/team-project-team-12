<script lang="ts">
    export let data;

    const typedData = data as { username?: string };

    const username = typedData ? typedData.username : null;
</script>
<h1>Welcome {username}</h1>