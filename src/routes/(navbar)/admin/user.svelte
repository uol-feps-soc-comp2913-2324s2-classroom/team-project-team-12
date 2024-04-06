<script lang="ts">
    import type { user } from '$lib/interfaces';
    import { Button, Input,Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
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
        if (user.subscription_start_date) formData.append('subscription_start_date', user.subscription_start_date.toString());
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
<Input type="text" placeholder="Search..." bind:value={searchTerm} />
<Table>
    <TableHead>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Username</TableHeadCell>
            <TableHeadCell>First Name</TableHeadCell>
            <TableHeadCell>Last Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Password</TableHeadCell>
            <TableHeadCell>Membership Type</TableHeadCell>
            <TableHeadCell>Next Payment</TableHeadCell>
            <TableHeadCell>Last Payment</TableHeadCell>
            <TableHeadCell>Paid</TableHeadCell>
            <TableHeadCell>Default Publicity</TableHeadCell>
            <TableHeadCell>Admin Status</TableHeadCell>
            <TableHeadCell>Stripe Token</TableHeadCell>
            <TableHeadCell>Owner</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each users.filter(user => user.username.includes(searchTerm)  || user.id.toString().includes(searchTerm) || user.first_name && user.first_name.includes(searchTerm) || (user.last_name && user.last_name.includes(searchTerm))).slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage) as user (user.id)}
            {#if lockedFields}
                <TableBodyRow>
                    <TableBodyCell>{user.id}</TableBodyCell>
                    <TableBodyCell>{user.username}</TableBodyCell>
                    <TableBodyCell>{user.first_name}</TableBodyCell>
                    <TableBodyCell>{user.last_name}</TableBodyCell>
                    <TableBodyCell>{user.email}</TableBodyCell>
                    <TableBodyCell>{user.password}</TableBodyCell>
                    <TableBodyCell>{user.membership_type}</TableBodyCell>
                    <TableBodyCell>{user.subscription_start_date}</TableBodyCell>
                    <TableBodyCell>{user.paid}</TableBodyCell>
                    <TableBodyCell>{user.default_publicity}</TableBodyCell>
                    <TableBodyCell>{user.admin_status}</TableBodyCell>
                    <TableBodyCell>{user.stripe_token}</TableBodyCell>
                    <TableBodyCell>{user.owner}</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#if !lockedFields}
                <TableBodyRow>
                    <TableBodyCell>{user.id}</TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.username} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.first_name} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.last_name} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.email} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.password} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.membership_type} /></TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.subscription_start_date} /></TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={user.paid}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.default_publicity} /></TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={user.admin_status}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <TableBodyCell><Input type="text" bind:value={user.stripe_token} /></TableBodyCell>
                    <TableBodyCell>
                        <Select bind:value={user.owner}>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </Select>
                    </TableBodyCell>
                    <Button on:click={() => handleUpdate(user)}>Submit</Button>
                    <Button on:click={() => deleteUser(user)}>Delete</Button>
                </TableBodyRow>
            {/if}
        {/each}
    </TableBody>
</Table>

<Button on:click={() => (lockedFields = lockedFields ? 0 : 1)}>Toggle Edit</Button>
{#if !lockedFields}
    <Button on:click={handleUpdateAll}>Update All</Button>
{/if}
<Button on:click={prevPage} disabled={currentPage === 0}>Previous</Button>
<Button on:click={nextPage} disabled={(currentPage + 1) * usersPerPage >= users.length}>Next</Button>
<div>
Results Per Page
<Select bind:value={usersPerPage} on:change={() => currentPage = 0}>
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
</Select>
</div>
