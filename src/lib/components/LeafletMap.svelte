<script lang="ts">
    import { dev } from '$app/environment';
    import { pipe } from 'ramda';

    import type { LatLngExpression } from 'leaflet';

    // Default values used to instantiate the map
    export let center: LatLngExpression = [53.807099641020486, -1.5549898846545835]; // Leeds Uni
    export let zoom: number = 17;
    export let zoomControl: boolean = false;

    // Stores coordinates of points visited in the route
    let path: LatLngExpression[] = [];

    // Print `path` on update (for debugging)
    // $: if (dev) console.info('LEAFLET PATH:', path);

    const mapHandler = async (container: HTMLElement) => {
        // Dynamically import leaflet (due to bug from leaflet developers)
        const L = await import('leaflet');

        // Create and initialize the map
        let map = L.map(container, {
            center,
            zoom,
            zoomControl,
        });

        // Add a tile layer (styles) to the map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map);

        // Append a new route to the map
        let route = new L.Polyline(path, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1,
        });

        route.addTo(map);

        // Convert a `GeolocationPosition` object into a `LatLngExpression` one
        const geolocationPositionToLatLngExpression = (p: GeolocationPosition): LatLngExpression => [
            p.coords.latitude,
            p.coords.longitude,
        ];

        // Append the user's location to the map path
        const appendToPath = (p: LatLngExpression): LatLngExpression => {
            path = [...path, p];
            route.setLatLngs(path);

            return p;
        };

        // Pan the camera to a new position
        const moveToPos = (p: LatLngExpression): LatLngExpression => {
            map.flyTo(p, zoom);
            return p;
        };

        // Handle new geolocation updates
        const handleNewPosition = pipe(geolocationPositionToLatLngExpression, appendToPath, moveToPos);

        // Update the route with user's new locations
        navigator.geolocation.watchPosition(handleNewPosition, console.error);
    };
</script>

<div style="margin: 80px; width: 80vw; height: 80vh;" use:mapHandler></div>
