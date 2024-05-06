<svelte:options accessors />

<script lang="ts">
    import type { RouteEntry } from '$lib/interfaces';
    import type { LatLngTuple, Map } from 'leaflet';

    // Default values used to instantiate the map
    export let map: Map = undefined;
    export let center: LatLngTuple = [53.807099641020486, -1.5549898846545835]; // Leeds Uni
    export let zoom: number = 17;
    export let zoomControl: boolean = false;
    export let userRoutes: RouteEntry[] = [];
    export let groupRoutes: any = {};
    export let style: string = 'CartoDB.Voyager';
    export let selectedRoute: RouteEntry | undefined = undefined;
    export let centerOnUser = false;
    export let userPos: LatLngTuple;

    // TODO: Rewrite
    $: routes = [
        ...userRoutes,
        ...Object.values(groupRoutes)
            .map((i) => Object.values(i))
            .flat(1)
            .flat(1),
    ];

    let userMarker;
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

    export const selectRoute = (id: number) => {
        // Unset the selected polyline styles
        resetPolylineStyles();

        // Update the selected polyline's style
        let polyline = polylines[id];
        polyline.setStyle(polylineSelectedStyle);

        // Fit the map within the user's viewport
        map.fitBounds(polyline.getBounds().pad(0.15));

        // Assign selectedRoute to the route
        selectedRoute = routes.find((r) => r.id == id) as RouteEntry;
    };

    export const hideRoute = (id: number) => {
        map.removeLayer(polylines[id]);
        if (selectRoute.id == id) selectedRoute = undefined;
    };

    export const showRoute = (id: number) => {
        polylines[id].addTo(map);
    };

    const resetPolylineStyles = () => {
        for (let polyline in polylines) polylines[polyline].setStyle(polylineStyle);
    };

    const mapHandler = async (container: HTMLElement) => {
        // Dynamically import leaflet (due to bug from leaflet developers)
        let L = await import('leaflet');
        let { GestureHandling } = await import('leaflet-gesture-handling');
        await import('leaflet-providers');

        // Improve map control using complex gesture handling
        L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

        // Create and initialize the map
        map = L.map(container, {
            center,
            zoom,
            zoomControl,
            attributionControl: false,
            // gestureHandling: true,
        });

        // Add a tile layer (styles) to the map
        L.tileLayer.provider(style, { noWrap: true, minZoom: 5 }).addTo(map);

        // Append a new route to the map
        const createRoute = (r: RouteEntry) => {
            // Create the new polyline
            let route = new L.Polyline(r.path, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1,
            });

            // Handle click events
            route.on('click', () => selectRoute(r.id));

            // Track the new polyline throughout the program
            polylines[r.id] = route;
        };

        // Append each route to the map
        routes.forEach(createRoute);

        for (const polyline of Object.values(polylines)) polyline.addTo(map);

        if (userRoutes.length > 0) {
            // Find the most recent route
            let recentRoute = userRoutes.reduce((a, b) => (new Date(a.createdOn) > new Date(b.createdOn) ? a : b));

            // Display the most recent route on the user's screen
            if (routes) map.fitBounds(polylines[recentRoute.id].getBounds().pad(0.1));
        }

        if (centerOnUser) {
            navigator.geolocation.watchPosition((p) => {
                const point = [p.coords.latitude, p.coords.longitude];

                if (userMarker) map.removeLayer(userMarker);
                userMarker = L.marker(point);
                map.addLayer(userMarker);

                userPos = point;
            });
        }
    };
</script>

<div class="m-0 p-0 w-full h-full" use:mapHandler />
