import { Decimal } from 'decimal.js';
import type { LatLngTuple } from 'leaflet';

export type Path = LatLngTuple[];

export interface RouteEntry {
    name: string;
    creator: string;
    createdOn: Date;
    completionTime: number;
    path: Path;
}

export interface GroupedRouteEntry {
    name: string;
    creator: string;
    createdOn: Date;
    completionTime: number;
    path: Path;
    group: string | null;
}


export interface user {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    membership_type: number | null;
    subscription_start_date: Date;
    paid: boolean;
    default_publicity: number | null;
    admin_status: boolean;
    stripe_token: string | null;
    subscription_id: string | null;
    owner: boolean;
}

export interface relationship {
    id: number;
    user_id1: number;
    user_id2: number;
    friend_request: boolean;
    is_friend: boolean;
    is_blocked: boolean;
}

export interface route {
    id: number;
    route_name: string | null;
    created_on: Date | null;
    length: number | null;
    approximate_completion_time: number | null;
    creator: number | null;
    publicity: number | null;
}

export interface group {
    id: number;
    name: string;
    creator: number;
    publicity: number;
}

export interface group_membership {
    id: number;
    group_id: number;
    user_id: number;
    request: boolean;
    member: boolean;
    admin: boolean;
}

export interface group_route {
    id: number;
    group_id: number;
    route_id: number;
    priority: number;
}

export interface route_coordinate {
    id: number;
    route_id: number | null;
    latitude: Decimal | null | string;
    longitude: Decimal | null | string;
    order_position: number | null;
}
