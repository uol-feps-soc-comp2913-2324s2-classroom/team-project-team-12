import { describe, test, expect, afterEach } from 'vitest';
import { cleanup, fireEvent, getByText, render, screen } from '@testing-library/svelte';

import { default as Data } from './routes/(navbar)/account/data.svelte';
import { default as EditPass } from './routes/(navbar)/account/editpass.svelte';
import { default as EditPrivacy } from './routes/(navbar)/account/editprivacy.svelte';
import { default as EditUser } from './routes/(navbar)/account/edituser.svelte';
import { default as Tabs } from './routes/(navbar)/admin/Tabs.svelte';
import { default as Groups } from './routes/(navbar)/admin/groups.svelte';
import { default as GroupMembership } from './routes/(navbar)/admin/group_membership.svelte';
import { default as GroupRoutes } from './routes/(navbar)/admin/group_routes.svelte';
import { default as Relationship } from './routes/(navbar)/admin/relationship.svelte';
import { default as RouteCoordinates } from './routes/(navbar)/admin/route_coordinates.svelte';
import { default as Routes } from './routes/(navbar)/admin/routes.svelte';
import { default as User } from './routes/(navbar)/admin/user.svelte';

describe('data.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText, getByRole } = render(Data, {
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
        });

        expect(getByText('USERNAME')).toBeTruthy();
    });
});

describe('editpass.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByRole } = render(EditPass);

        expect(getByRole('button', { name: 'Edit' })).toBeTruthy();
    });
});

describe('editprivacy.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByRole } = render(EditPrivacy);

        expect(getByRole('button', { name: 'Edit' })).toBeTruthy();
    });
});

describe('edituser.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByRole } = render(EditUser);

        expect(getByRole('button', { name: 'Edit' })).toBeTruthy();
    });
});

describe('tabs.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(Tabs, { itemTuples: [('Demo Tab', 'Hello world!')] });

        expect(getByText('Tab title')).toBeTruthy();
    });
});

describe('groups.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(Groups, {
            prop: [
                {
                    id: 0,
                    name: 'test group',
                    creator: 1,
                    publicity: 1,
                    users: [],
                },
            ],
        });

        expect(getByText('test group')).toBeTruthy();
    });
});

describe('routes.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(Routes, {
            prop: [
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
        });

        expect(getByText('test route')).toBeTruthy();
    });
});

describe('group_membership.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(GroupMembership, {
            prop: [
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
        });

        expect(getByText('Group ID')).toBeTruthy();
        expect(getByText('User ID')).toBeTruthy();
        expect(getByText('Request')).toBeTruthy();
    });
});

describe('group_routes.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(GroupRoutes, {
            prop: [
                {
                    id: 0,
                    group_id: 0,
                    route_id: 0,
                    priority: 0,
                },
            ],
        });

        expect(getByText('Group ID')).toBeTruthy();
        expect(getByText('Route ID')).toBeTruthy();
    });
});

describe('relationship.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(Relationship, {
            prop: [
                {
                    id: 1,
                    user_id1: 1,
                    user_id2: 2,
                    friend_request: true,
                    is_friend: true,
                    is_blocked: false,
                },
            ],
        });

        expect(getByText('friend_request')).toBeTruthy();
        expect(getByText('is_friend')).toBeTruthy();
    });
});

describe('route_coordinates.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(RouteCoordinates, {
            prop: [
                {
                    id: 0,
                    route_id: 0,
                    latitude: '1',
                    longitude: '1',
                    order_position: 0,
                },
            ],
        });

        expect(getByText('Latitude')).toBeTruthy();
        expect(getByText('Longitude')).toBeTruthy();
    });
});

describe('user.svelte', () => {
    afterEach(cleanup);

    test('Renders as expected', () => {
        const { getByText } = render(User, {
            prop: [
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
        });

        expect(getByText('john_doe')).toBeTruthy();
        expect(getByText('John')).toBeTruthy();
        expect(getByText('Doe')).toBeTruthy();
    });
});
