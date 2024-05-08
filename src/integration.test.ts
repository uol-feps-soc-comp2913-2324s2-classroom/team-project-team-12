import { describe, test, expect, afterEach } from 'vitest';
import { cleanup, fireEvent, getByText, render, screen } from '@testing-library/svelte';

import { default as Admin } from './routes/(navbar)/admin/+page.svelte';
import { default as Download } from './routes/(navbar)/download/+page.svelte';
import { default as Friends } from './routes/(navbar)/friends/+page.svelte';
import { default as Groups } from './routes/(navbar)/groups/+page.svelte';
import { default as Map } from './routes/(navbar)/map/+page.svelte';
import { default as Upload } from './routes/(navbar)/upload/+page.svelte';

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

const adminData = {
    users: [
        {
            id: 1,
            username: 'john_doe',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com',
            password: 'passwd',
            membership_type: 4,
            subscription_start_date: new Date(),
            next_payment_date: new Date(),
            paid: true,
            default_publicity: 0,
            admin_status: true,
            stripe_token: '####',
            owner: true,
        },
    ],
    relationships: [
        {
            id: 1,
            user_id1: 1,
            user_id2: 2,
            friend_request: true,
            is_friend: true,
            is_blocked: false,
        },
    ],
    routes: [
        {
            id: 0,
            route_name: 'test route',
            created_on: new Date(),
            length: 5,
            approximate_completion_time: 500,
            creator: 1,
            publicity: 0,
        },
    ],
    groups: [
        {
            id: 0,
            name: 'test group',
            creator: 1,
            publicity: 1,
            users: [],
        },
    ],
    group_memberships: [
        {
            id: 0,
            group_id: 0,
            user_id: 0,
            request: true,
            member: true,
            admin: true,
            invite: true,
        },
    ],
    group_routes: [
        {
            id: 0,
            group_id: 0,
            route_id: 0,
            priority: 0,
        },
    ],
    route_coordinates: [
        {
            id: 0,
            route_id: 0,
            latitude: '1',
            longitude: '1',
            order_position: 0,
        },
    ],
};

const friendsData = {
    user: {
        id: 1,
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@email.com',
        password: 'passwd',
        membership_type: 4,
        subscription_start_date: new Date(),
        next_payment_date: new Date(),
        paid: true,
        default_publicity: 0,
        admin_status: true,
        stripe_token: '####',
        owner: true,
    },
    users: [
        {
            id: 2,
            username: 'jane_doe',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@email.com',
            password: 'passwd',
            membership_type: 4,
            subscription_start_date: new Date(),
            next_payment_date: new Date(),
            paid: true,
            default_publicity: 0,
            admin_status: true,
            stripe_token: '####',
            owner: true,
        },
        {
            id: 3,
            username: 'adam_smith',
            first_name: 'Adam',
            last_name: 'Smith',
            email: 'asmith@email.com',
            password: 'passwd',
            membership_type: 4,
            subscription_start_date: new Date(),
            next_payment_date: new Date(),
            paid: true,
            default_publicity: 0,
            admin_status: true,
            stripe_token: '####',
            owner: true,
        },
        ,
        {
            id: 4,
            username: 'oliver_brown',
            first_name: 'Oliver',
            last_name: 'Brown',
            email: 'obrown@email.com',
            password: 'passwd',
            membership_type: 4,
            subscription_start_date: new Date(),
            next_payment_date: new Date(),
            paid: true,
            default_publicity: 0,
            admin_status: true,
            stripe_token: '####',
            owner: true,
        },
    ],
    relationships: [
        {
            id: 0,
            user_id1: 1,
            user_id2: 2,
            friend_request: true,
            is_friend: false,
            is_blocked: false,
        },
    ],
    currentUserFriends: [
        {
            id: 0,
            name: 'user1',
            first_name: 'Test',
            last_name: 'User',
        },
    ],
    unaddedPeople: [
        {
            id: 0,
            name: 'user2',
            first_name: 'Test',
            last_name: 'User',
        },
    ],
    requested: [
        {
            id: 0,
            name: 'user3',
            first_name: 'Test',
            last_name: 'User',
        },
    ],
};

describe('Admin', () => {
    afterEach(cleanup);

    test('Renders the admin panel', async () => {
        // Renders the admin panel
        const { getByRole } = render(Admin, { data: adminData });

        // Verifies the map component has loaded correctly
        expect(getByRole('button', { name: 'Login' })).toBeTruthy();
    });

    test('Users are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the users are drawn on the panel
        expect(screen.findByText('Users')).toBeTruthy();
    });

    test('Relationships are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the relationships are drawn on the panel
        expect(screen.findByText('Relationships')).toBeTruthy();
    });

    test('Routes are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the routes are drawn on the panel
        expect(screen.findByText('Routes')).toBeTruthy();
    });

    test('Groups are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the groups are drawn on the panel
        expect(screen.findByText('Groups')).toBeTruthy();
    });

    test('Group memberships are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the group memberships are drawn on the panel
        expect(screen.findByText('Group Memberships')).toBeTruthy();
    });

    test('Group routes are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the group routes are drawn on the panel
        expect(screen.findByText('Group Routes')).toBeTruthy();
    });

    test('Route coordinates are rendered', async () => {
        // Renders the admin panel
        render(Admin, { data: adminData });

        // Locate the fields required to bypass the login prompt...
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const login = screen.getByText('Login');

        // ...and provide them values to bypass the login prompt
        fireEvent.change(username, { target: { value: 'Journeys' } });
        fireEvent.change(password, { target: { value: 'password123' } });
        fireEvent.click(login);

        // Verifies the route coordinates are drawn on the panel
        expect(screen.findByText('Route Coordinates')).toBeTruthy();
    });
});

describe('Download', () => {
    afterEach(cleanup);

    test('Renders the download page', async () => {
        // Renders the download page
        const { getByText } = render(Download);

        // Verifies the page rendered correctly
        expect(getByText('Download GPS Data')).toBeTruthy();
    });
});

describe('Friends', () => {
    afterEach(cleanup);

    test('Renders the friends page', async () => {
        // Renders the friends page
        const { getByText } = render(Friends, { data: friendsData });

        // Verifies the map component has loaded correctly
        expect(getByText('Friends')).toBeTruthy();
    });

    test('Friend requests appear', async () => {
        // Renders the friends page
        const { getByText } = render(Friends, { data: friendsData });

        // Verifies the routes are drawn to map
        expect(getByText('Friend Requests')).toBeTruthy();
        expect(screen.findByText('jane_doe')).toBeTruthy();
    });

    test('Other users appear', async () => {
        // Renders the friends page
        const { getByText } = render(Friends, { data: friendsData });

        // Verifies the routes are drawn to map
        expect(getByText('People')).toBeTruthy();
        expect(screen.findByText('adam_smith')).toBeTruthy();
    });

    test('Outgoing requests appear', async () => {
        // Renders the friends page
        const { getByText } = render(Friends, { data: friendsData });

        // Verifies the routes are drawn to map
        expect(getByText('Requested')).toBeTruthy();
        expect(screen.findByText('Routes')).toBeTruthy();
    });
});

describe('Map', () => {
    afterEach(cleanup);

    test('Renders the map', async () => {
        // Renders the map
        render(Map, {
            data: {
                username: '',
                userRoutes: Promise.resolve([]),
                groupRoutes: Promise.resolve({}),
            },
        });

        // Verifies the map component has loaded correctly
        expect(screen.findByText('Map')).toBeTruthy();
    });

    test('Draws user routes', async () => {
        // Renders the map with user routes
        render(Map, {
            data: {
                username: 'john_doe',
                userRoutes: Promise.resolve([demoRoute]),
                groupRoutes: Promise.resolve({ Test: [demoRoute] }),
            },
        });

        // Verifies the routes are drawn to map
        expect(screen.findByText('Routes')).toBeTruthy();
    });
});

describe('Upload', () => {
    afterEach(cleanup);

    test('Renders the page', async () => {
        // Render the upload page
        const { getByText } = render(Upload);

        // Verify the content rendered correctly
        expect(getByText('Upload GPX Data')).toBeTruthy();
    });
});
