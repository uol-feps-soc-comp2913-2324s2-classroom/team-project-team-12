<script lang="ts">
    import type { user } from '$lib/interfaces';

    export let users: user[];

    const handleUpdate = async (user: user) => {
        const formData = new FormData();
        formData.append('type', 'updateUser');
        formData.append('id', user.id.toString());
        if (user.username) formData.append('username', user.username);
        if (user.first_name) formData.append('first_name', user.first_name);
        if (user.last_name) formData.append('last_name', user.last_name);
        if (user.email) formData.append('email', user.email);
        if (user.password) formData.append('password', user.password);
        if (user.membership_type) formData.append('membership_type', user.membership_type.toString());
        if (user.next_payment) formData.append('next_payment', user.next_payment.toString());
        if (user.default_publicity) formData.append('default_publicity', user.default_publicity.toString());
        if (user.admin_status) formData.append('admin_status', user.admin_status.toString());
        if (user.stripe_token) formData.append('stripe_token', user.stripe_token);

        try {
            if (!formData.has('id')) {
                console.error('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                console.error('No type provided');
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Update successful');
            } else {
                console.error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    const deleteUser = async (user: user) => {
        const formData = new FormData();
        formData.append('type', 'deleteUser');
        formData.append('id', user.id.toString());

        try {
            if (!formData.has('id')) {
                console.error('No ID provided');
                return;
            }
            if (!formData.has('type')) {
                console.error('No type provided');
                return;
            }
            const response = await fetch('/admin', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message || 'Delete successful');
            } else {
                console.error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    var lockedFields = 1;
</script>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Membership Type</th>
            <th>Next Payment</th>
            <th>Default Publicity</th>
            <th>Admin Status</th>
            <th>Stripe Token</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user}
            {#if lockedFields}
                <tr>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.membership_type}</td>
                    <td>{user.next_payment}</td>
                    <td>{user.default_publicity}</td>
                    <td>{user.admin_status}</td>
                    <td>{user.stripe_token}</td>
                </tr>
            {/if}
            {#if !lockedFields}
                <tr>
                    <td>{user.id}</td>
                    <td><input type="text" bind:value={user.username} /></td>
                    <td><input type="text" bind:value={user.first_name} /></td>
                    <td><input type="text" bind:value={user.last_name} /></td>
                    <td><input type="text" bind:value={user.email} /></td>
                    <td><input type="text" bind:value={user.password} /></td>
                    <td><input type="text" bind:value={user.membership_type} /></td>
                    <td><input type="text" bind:value={user.next_payment} /></td>
                    <td><input type="text" bind:value={user.default_publicity} /></td>
                    <td><input type="text" bind:value={user.admin_status} /></td>
                    <td><input type="text" bind:value={user.stripe_token} /></td>
                    <button on:click={() => handleUpdate(user)}>Submit</button>
                    <button on:click={() => deleteUser(user)}>Delete</button>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>
<button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
