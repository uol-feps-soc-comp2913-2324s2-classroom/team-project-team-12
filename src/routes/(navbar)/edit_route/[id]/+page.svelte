<script lang="ts">
    import type { route, user } from '$lib/interfaces';
    import { Alert,Card, Input ,FloatingLabelInput, Button, Select,Heading } from 'flowbite-svelte';
    import { PenOutline } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';

    export let data;
    let route: route = data.props.route;
    let user: user = data.props.user;
    let alertMessage:string | null = null;
    let alertType:string | null = null;
    let alertColour:string | null = null;
    let privacySettings = [
        { value: 1, name: 'Private' },
        { value: 2, name: 'Friends Only' },
        { value: 3, name: 'Public' },
    ];


    if (user.id != route.creator) {
        goto("../routes/");
    }
    
    let routeID = route.id;
    if (routeID == undefined) {
        goto("../routes/");
    }
    let routeName = route.route_name;
    let publicity = route.publicity;
    let length = route.length;
    let approximateTime = route.approximate_completion_time;

    if (publicity == null) {
        publicity = 1;
    }


    function submitEditRoute() {
        const formData = new FormData();
        formData.append('type', 'editRoute');
        formData.append('routeID', routeID.toString());
        formData.append('userID', user.id.toString());

        if (routeName !== null && routeName !== undefined) {
            formData.append('routeName', routeName);
        }
        if (publicity !== null && publicity !== undefined) {
            formData.append('publicity', publicity.toString());
        }
        if (length !== null && length !== undefined) {
            formData.append('length', length.toString());
        }
        if (approximateTime !== null && approximateTime !== undefined) {
            formData.append('approximateTime', approximateTime.toString());
        }


        fetch('/edit_route/${id}', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                let actualResponse = data.data;
                actualResponse = JSON.parse(actualResponse);
                console.log(actualResponse);
                if (actualResponse[1] == 200) {
                    alertMessage = 'Route edited successfully';
                    alertType = 'success';
                    alertColour = 'green';
                    //goto(`../routes`);
                } else {
                    //alert('Route edit failed');
                    alertMessage = actualResponse[3];
                    alertType = 'danger';
                    alertColour = 'red';
                }
            });
}

function deleteRoute() {
    const formData = new FormData();
    formData.append('type', 'deleteRoute');
    formData.append('routeID', routeID.toString());
    formData.append('userID', user.id.toString());

    fetch('/edit_route/${id}', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            let actualResponse = data.data;
            actualResponse = JSON.parse(actualResponse);
            console.log(actualResponse);
            if (actualResponse[1] == 200) {
                alert('Route deleted successfully');
                goto(`../routes`);
            } else {
                alertMessage = actualResponse[3];
                alertType = 'danger';
                alertColour = 'red';
            }
        });
    }

</script>

<main>
    <Card>
        <div class="card-item">
        <Heading  class="mb-4">Edit Route</Heading>
        </div>
        {#if alertMessage}
            <div class="card-item">
            <Alert color={alertColour}  dismissable on:close={() => { alertMessage = null; alertType = null; }}>
                {alertMessage}
            </Alert>
            </div>
        {/if}
        <div class="card-item">
        <FloatingLabelInput style="outlined"  bind:value={routeName} required > Route Name </FloatingLabelInput>
        </div><div class="card-item">
        <Select bind:value={publicity} required items={privacySettings}> Privacy </Select>
        </div><div class="card-item">
        <FloatingLabelInput style="outlined" bind:value={length} placeholder="Length" >Length</FloatingLabelInput>
        </div><div class="card-item">
        <FloatingLabelInput style="outlined" bind:value={approximateTime} placeholder="Approximate Time">Approximate Time</FloatingLabelInput>
        </div><div class="card-item">
        <div class="buttonBox">
        <Button on:click={deleteRoute}>Delete</Button>
        <Button on:click={submitEditRoute}>Submit</Button>
        </div>

    </Card>
</main>

<style>
    Card {
        width: 50%;
        margin: 10px;
        padding: 10px;
    }

    main {
        padding: 20px;
        justify-content: center;
        align-items: center;
        display: flex;

        

    }

    .buttonBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .card-item {
    margin-bottom: 1vh; /* Adjust as needed */
    }
    
</style>

