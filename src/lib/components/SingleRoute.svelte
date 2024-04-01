<script lang="ts">
    import { LeafletMap } from '$lib';

    import type { RouteEntry } from '$lib/interfaces';

    export let route: RouteEntry;
</script>

<div class="container w-full h-40 mt-2 mb-5 pointer-events-none">
    <LeafletMap style="CartoDB.VoyagerNoLabels" userRoutes={[route]} selectedRoute={route} />
</div>
