<script lang="ts">
    import { LeafletMap } from '$lib';

    import type { RouteEntry } from '$lib/interfaces';

    export let route: RouteEntry;
</script>

<div class="container w-full h-full pointer-events-none">
    <LeafletMap style="CartoDB.VoyagerNoLabels" userRoutes={[route]} selectedRoute={route} />
</div>
