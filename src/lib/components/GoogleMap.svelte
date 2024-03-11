<script lang="ts">
    import { dev } from '$app/environment';
    import { pipe } from 'ramda';
    import * as gmaps from '@googlemaps/js-api-loader';

    // Include a default map style
    import mapStyles from '$lib/google-map-style.json';

    // Local type definitions used by this component
    type GoogleCoord = google.maps.LatLngLiteral;
    type GoogleMapStyle = google.maps.MapTypeStyle[];

    // Default values used to initialize the map
    export let center: GoogleCoord = { lat: 53.807099641020486, lng: -1.5549898846545835 }; // Leeds Uni
    export let zoom: number = 16;
    export let disableDefaultUI: boolean = true;
    export let styles: GoogleMapStyle = mapStyles as GoogleMapStyle;

    // Stores coordinates of points visited in the route
    let path: GoogleCoord[] = [];

    // Print `path` on update (for debugging)
    // $: if (dev) console.info('GOOGLE MAPS PATH:', path);

    const mapHandler = async (container: HTMLElement) => {
        // TODO: Load API loader as singleton
        // Instantiate the API loader
        const loader = new gmaps.Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        });

        let maps = await loader.importLibrary('maps');

        // Create and initialize the map
        let map = new maps.Map(container, {
            center,
            zoom,
            disableDefaultUI,
            styles,
        });

        // Append a new route to the map
        let route = new maps.Polyline({
            path,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        route.setMap(map);

        // Convert `GeolocationPosition` objects to `GoogleCoord` ones
        const geolocationPositionToGoogleCoord = (p: GeolocationPosition): GoogleCoord => ({
            lat: p.coords.latitude,
            lng: p.coords.longitude,
        });

        // Append the user's location to the map path
        const appendToPath = (p: GoogleCoord): GoogleCoord => {
            path = [...path, p];
            route.setPath(path);

            return p;
        };

        // Pan the camera to a new position
        const moveToPos = (p: GoogleCoord): GoogleCoord => {
            map.panTo(p);
            return p;
        };

        // Handle new geolocation updates
        const handleNewPosition = pipe(geolocationPositionToGoogleCoord, appendToPath, moveToPos);

        // Update the route with user's new locations
        navigator.geolocation.watchPosition(handleNewPosition, console.error);
    };
</script>

<div style="margin: 80px; width: 80vw; height: 80vh;" use:mapHandler />
