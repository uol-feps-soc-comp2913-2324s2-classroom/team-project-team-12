<script lang="ts">
    import type { route, user } from '$lib/interfaces';
    import { Input , Button, Select } from 'flowbite-svelte';
    import { PenOutline } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';

    export let data;
    let route: route = data.props.route;
    let user: user = data.props.user;

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
                    alert('Route edited successfully');
                    goto(`../routes`);
                } else {
                    alert('Route edit failed');
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
                alert('Route delete failed');
            }
        });
    }

</script>

<main>
    <div class="container">
        <div class="grid">
            <div class="grid-item">
                <Input bind:value={routeName} placeholder="Route Name" />
                <Select bind:value={publicity} items={privacySettings} />
                <Input bind:value={length} placeholder="Length" />
                <Input bind:value={approximateTime} placeholder="Approximate Time" />
                <Button on:click={deleteRoute}>Delete</Button>
                <Button on:click={submitEditRoute}>Submit</Button>
            </div>
        </div>
    </div>
</main>

