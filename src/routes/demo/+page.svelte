<script lang="ts">
    import { Modal, Content, Trigger}  from "sv-popup";
    import { GoogleMap, LeafletMap } from '$lib';
    import Download from './downloadData.svelte';

    export let data;
    export const user = data.curUser;

    let API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <GoogleMap />
    <LeafletMap />
    <div class="download">
        <Modal basic>
            <Content>
                <Download />
            </Content>
            <Trigger>
                <button>Download</button>
            </Trigger>
        </Modal>
    </div>
</div>
