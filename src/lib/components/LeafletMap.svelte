<script lang="ts">
    import type { RouteEntry } from '$lib/interfaces';
    import type { FeatureGroup, LatLngExpression, LatLngTuple, Map } from 'leaflet';

    // Default values used to instantiate the map
    export let center: LatLngTuple = [53.807099641020486, -1.5549898846545835]; // Leeds Uni
    export let zoom: number = 17;
    export let zoomControl: boolean = false;
    export let routes: RouteEntry[] = [];
    export let selectedRoute: RouteEntry;

    let map: Map;
    let polylines: any = {};

    export const selectRoute = (name: string) => {
        for (let polyline in polylines) {
            polylines[polyline].setStyle({
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1,
            });
        }

        let polyline = polylines[name];
        polyline.setStyle({
            color: 'blue',
            weight: 6,
        });

        map.fitBounds(polyline.getBounds());

        selectedRoute = routes.find((r) => r.name == name) as RouteEntry;
    };

    const mapHandler = async (container: HTMLElement) => {
        // Dynamically import leaflet (due to bug from leaflet developers)
        let L = await import('leaflet');
        await import('leaflet-providers');

        // Create and initialize the map
        map = L.map(container, {
            center,
            zoom,
            zoomControl,
        });

        // Add a tile layer (styles) to the map
        L.tileLayer.provider('CartoDB.Voyager').addTo(map);

        // Pan the camera to a new position
        const moveToPos = (p: LatLngExpression): LatLngExpression => {
            map.panTo(p);
            return p;
        };

        // Append a new route to the map
        const createRoute = (r: RouteEntry) => {
            let route = new L.Polyline(r.path, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1,
            });

            // Handle click events
            route.on('click', () => {
                selectRoute(r.name);
            });

            route.addTo(map);
            polylines[r.name] = route;
        };

        // Append each route to the map
        routes.forEach(createRoute);

        // Get the most recent route
        let recentRoute = routes.reduce((a, b) => (new Date(a.createdOn) > new Date(b.createdOn) ? a : b));

        // Display the most recent route on the user's screen
        if (routes) map.fitBounds(polylines[recentRoute.name].getBounds());
    };
</script>

<div style="margin: 0; padding: 0; width: 100vw; height: 100vh;" use:mapHandler />
