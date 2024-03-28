<script lang="ts">
    import type { RouteEntry } from '$lib/interfaces';
    import type { LatLngTuple, Map } from 'leaflet';

    // Default values used to instantiate the map
    export let center: LatLngTuple = [53.807099641020486, -1.5549898846545835]; // Leeds Uni
    export let zoom: number = 17;
    export let zoomControl: boolean = false;
    export let userRoutes: RouteEntry[] = [];
    export let groupRoutes: any = {};
    export let selectedRoute: RouteEntry | undefined = undefined;

    // TODO: Rewrite
    $: routes = [
        ...userRoutes,
        ...Object.values(groupRoutes)
            .map((i) => Object.values(i))
            .flat(1)[0],
    ];

    let map: Map;
    let polylines: any = {};

    let polylineStyle = {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1,
    };

    let polylineSelectedStyle = {
        color: 'blue',
        weight: 6,
    };

    export const selectRoute = (name: string) => {
        // Unset the selected polyline styles
        resetPolylineStyles();

        // Update the selected polyline's style
        let polyline = polylines[name];
        polyline.setStyle(polylineSelectedStyle);

        // Fit the map within the user's viewport
        map.fitBounds(polyline.getBounds());

        // Assign selectedRoute to the route
        selectedRoute = routes.find((r) => r.name == name);
    };

    const resetPolylineStyles = () => {
        for (let polyline in polylines) polylines[polyline].setStyle(polylineStyle);
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
            attributionControl: false,
        });

        // Add a tile layer (styles) to the map
        L.tileLayer.provider('CartoDB.Voyager').addTo(map);

        // Append a new route to the map
        const createRoute = (r: RouteEntry) => {
            // Create the new polyline
            let route = new L.Polyline(r.path, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1,
            }).addTo(map);

            // Handle click events
            route.on('click', () => selectRoute(r.name));

            // Track the new polyline throughout the program
            polylines[r.name] = route;
        };

        // Append each route to the map
        routes.forEach(createRoute);

        // Find the most recent route
        let recentRoute = userRoutes.reduce((a, b) => (new Date(a.createdOn) > new Date(b.createdOn) ? a : b));

        // Display the most recent route on the user's screen
        if (routes) map.fitBounds(polylines[recentRoute.name].getBounds());
    };
</script>

<div style="margin: 0; padding: 0; width: 100vw; height: 100vh;" use:mapHandler />
