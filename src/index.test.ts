import { LeafletMap, SingleRoute } from '$lib';
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';

import type { RouteEntry } from '$lib/interfaces';

const demoRoute: RouteEntry = {
    id: 1,
    name: 'Demo Route',
    creator: 'john_doe',
    createdOn: new Date(),
    completionTime: 100,
    path: [],
    publicity: 1,
    showOnMap: true,
    group: null,
};

describe('LeafletMap', () => {
    afterEach(cleanup);

    it('renders', async () => {
        const { container } = render(LeafletMap, { userRoutes: [demoRoute] });

        expect(container).toBeTruthy();
        // expect(container.querySelector('leaflet-panel')).toBeTruthy();
    });
});

describe('SingleRoute', () => {
    afterEach(cleanup);

    it('renders', async () => {
        const { container } = render(SingleRoute, { route: demoRoute });

        expect(container).toBeTruthy();
    });
});
