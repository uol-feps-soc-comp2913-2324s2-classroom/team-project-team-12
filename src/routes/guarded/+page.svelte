<script lang="ts">
    export let data;
    export const user = data.user;
</script>
<h1>Welcome {user?.username}</h1>