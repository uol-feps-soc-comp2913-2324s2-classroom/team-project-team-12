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

    import Tabs from './Tabs.svelte';
    let valueCount = 1;
    let itemTuples: { label: string,value:number, component: any, prop: any } [] = [];
    if (users) itemTuples.push({ label: 'Users',value: valueCount, component: User, prop: users});
    if (users) valueCount++;
    if (relationships) itemTuples.push({ label: 'Relationships',value: valueCount, component: Relationship, prop: relationships});
    if (relationships) valueCount++;
    if (routes) itemTuples.push({ label: 'Routes',value: valueCount, component: Routes, prop: routes});
    if (routes) valueCount++;
    if (groups) itemTuples.push({ label: 'Groups',value: valueCount, component: Groups, prop: groups});
    if (groups) valueCount++;
    if (group_memberships) itemTuples.push({ label: 'Group Memberships',value: valueCount, component: GroupMembership, prop: group_memberships});
    if (group_memberships) valueCount++;
    if (group_routes) itemTuples.push({ label: 'Group Routes',value: valueCount, component: GroupRoutes, prop: group_routes});
    if (group_routes) valueCount++;
    if (route_coordinates) itemTuples.push({ label: 'Route Coordinates',value: valueCount, component: RouteCoordinates, prop: route_coordinates});
    if (route_coordinates) valueCount++;
</script>

<Tabs itemTuples={itemTuples} />

<!---
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
-->