<script lang="ts">
    import User from './user.svelte';
    import Relationship from './relationship.svelte';
    import Routes from './routes.svelte';
    import Groups from './groups.svelte';
    import GroupMembership from './group_membership.svelte';
    import GroupRoutes from './group_routes.svelte';
    import RouteCoordinates from './route_coordinates.svelte';
    import Tabs from './Tabs.svelte';

    export let data;
    let access = false;
    let username = '';
    let password = '';
    let errorMessage = '';

    async function login() {
        console.log('login start');
        if (username && password) {
            console.log('user name and password found');
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('type','login');
            console.log(username + ' ' + password);
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });
            
            let result = response.json().then((result) => {
                console.log(result);
                const parsedData = JSON.parse(result.data);
                const statusCode = parsedData[1];
                const message = parsedData[2];
                errorMessage = message;
                if (statusCode === 200) {
                    access = true;
                }
                else {
                    access = false;
                }
            });
        
            return;

        }
    }
    
    export const users = data.users;
    export const relationships = data.relationships;
    export const routes = data.routes;
    export const groups = data.groups;
    export const group_memberships = data.group_memberships;
    export const group_routes = data.group_routes;
    export const route_coordinates = data.route_coordinates;


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
{#if !access}
    <input type="text" bind:value={username} placeholder="username" />
    <input type="password" bind:value={password} placeholder="password" />
    <button on:click={() => login()}>Login</button>
    <p>{errorMessage}</p>
{/if}  
{#if access}
    <Tabs itemTuples={itemTuples} />
{/if}

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