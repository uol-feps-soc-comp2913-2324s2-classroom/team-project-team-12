<script lang="ts">
    import type { user } from '$lib/interfaces';
    export let prop: user[];
    let users = prop;

    let currentPage = 0;
    let usersPerPage = 10;

    const nextPage = () => {
        currentPage++;
    };
    const prevPage = () => {
        if (currentPage > 0) {
        currentPage--;
        }
    };

    let searchTerm = '';

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
        if (user.last_payment) formData.append('last_payment', user.last_payment.toString());
        formData.append('paid', user.paid.toString());
        if (user.default_publicity) formData.append('default_publicity', user.default_publicity.toString());
        formData.append('admin_status', user.admin_status.toString());
        if (user.stripe_token) formData.append('stripe_token', user.stripe_token);
        formData.append('owner', user.owner.toString());
        console.log(user.admin_status, user.owner);
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

    const handleUpdateAll = async () => {
        for (const user of users) {
            await handleUpdate(user);
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

        users = users.filter((u) => u.id !== user.id);
    };

    var lockedFields = 1;
</script>
<input type="text" placeholder="Search..." bind:value={searchTerm} />
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
            <th>Last Payment</th>
            <th>Paid</th>
            <th>Default Publicity</th>
            <th>Admin Status</th>
            <th>Stripe Token</th>
            <th>Owner</th>
        </tr>
    </thead>
    <tbody>
        {#each users.filter(user => user.username.includes(searchTerm)  || user.id.toString().includes(searchTerm) || user.first_name && user.first_name.includes(searchTerm) || (user.last_name && user.last_name.includes(searchTerm))).slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage) as user (user.id)}
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
                    <td>{user.last_payment}</td>
                    <td>{user.paid}</td>
                    <td>{user.default_publicity}</td>
                    <td>{user.admin_status}</td>
                    <td>{user.stripe_token}</td>
                    <td>{user.owner}</td>
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
                    <td><input type="text" bind:value={user.last_payment} /></td>
                    <td>
                        <select bind:value={user.paid}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td><input type="text" bind:value={user.default_publicity} /></td>
                    <td>
                        <select bind:value={user.admin_status}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <td><input type="text" bind:value={user.stripe_token} /></td>
                    <td>
                        <select bind:value={user.owner}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </td>
                    <button on:click={() => handleUpdate(user)}>Submit</button>
                    <button on:click={() => deleteUser(user)}>Delete</button>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</button>
{#if !lockedFields}
    <button on:click={handleUpdateAll}>Update All</button>
{/if}
<button on:click={prevPage} disabled={currentPage === 0}>Previous</button>
<button on:click={nextPage} disabled={(currentPage + 1) * usersPerPage >= users.length}>Next</button>
<div>
Results Per Page
<select bind:value={usersPerPage} on:change={() => currentPage = 0}>
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
</select>
</div>
