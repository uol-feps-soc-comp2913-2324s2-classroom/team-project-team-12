<script lang="ts">
    import type { RouteEntry } from '$lib/interfaces';
    import type { LatLngExpression, LatLngTuple } from 'leaflet';

    // Default values used to instantiate the map
    export let center: LatLngTuple = [53.807099641020486, -1.5549898846545835]; // Leeds Uni
    export let zoom: number = 17;
    export let zoomControl: boolean = false;
    export let routes: RouteEntry[] = [];

    const mapHandler = async (container: HTMLElement) => {
        // Dynamically import leaflet (due to bug from leaflet developers)
        let L = await import('leaflet');
        // import('leaflet-textpath');

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

        // Pan the camera to a new position
        const moveToPos = (p: LatLngExpression): LatLngExpression => {
            map.panTo(p);
            return p;
        };

        if (routes) moveToPos(routes[routes.length - 1].path[routes[routes.length - 1].path.length - 1]);

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
                route.setStyle({
                    color: 'blue',
                    weight: 6,
                });
                console.info(r);
            });

            // route.on('mouseover', () => {
            //     route.setText(r.name, { center: true, attributes: { fill: 'black' } });
            // });
            // route.on('mouseout', () => {
            //     route.setText(null);
            // });

            route.addTo(map);
        };

        // Append each route to the map
        routes.forEach(createRoute);
    };
</script>

<div style="margin: 0; padding: 0; width: 100vw; height: 100vh;" use:mapHandler />
