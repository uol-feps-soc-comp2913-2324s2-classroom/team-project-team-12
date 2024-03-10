<script lang="ts">
    export let data;
    import User from './user.svelte';
    export const users = data.users;

    import Relationship from './relationship.svelte';
    export const relationships = data.relationships;

    import Routes from './routes.svelte';
    export const routes = data.routes;

    import Groups from './groups.svelte';
    export const groups = data.groups;

    import GroupMembership from './group_membership.svelte';
    export const group_memberships = data.group_memberships;

    import GroupRoutes from './group_routes.svelte';
    export const group_routes = data.group_routes;

    import RouteCoordinates from './route_coordinates.svelte';
    export const route_coordinates = data.route_coordinates;
</script>

{#if users}
    <User {users} />
{/if}
{#if relationships}
    <Relationship {relationships} />
{/if}
{#if routes}
    <Routes {routes} />
{/if}
{#if groups}
    <Groups {groups} />
{/if}
{#if group_memberships}
    <GroupMembership {group_memberships} />
{/if}
{#if group_routes}
    <GroupRoutes {group_routes} />
{/if}
{#if route_coordinates}
    <RouteCoordinates {route_coordinates} />
{/if}
