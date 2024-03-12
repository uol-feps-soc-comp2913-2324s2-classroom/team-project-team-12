import { Decimal } from 'decimal.js';

export interface user {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    membership_type: number | null;
    next_payment: Date | null;
    default_publicity: number | null;
    admin_status: number | null;
    stripe_token: string | null;
}

export interface relationship {
    id: number;
    user_id1: number;
    user_id2: number;
    friend_request: number;
    is_friend: number;
    is_blocked: number;
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
    group_name: string;
    creator: number;
    publicity: number;
}

export interface group_membership {
    id: number;
    group_id: number;
    user_id: number;
    admin: number;
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