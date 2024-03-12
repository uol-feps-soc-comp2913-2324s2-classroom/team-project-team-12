<script lang="ts">
    import type { user } from '$lib/interfaces';

    export let users: user[];

    const handleUpdate = async (user: user) => {
        const formData = new FormData();
        formData.append('type', 'updateUser');
        formData.append('id', user.id.toString());
        if (user.username) formData.append('username', user.username);


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
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user}
            <tr>
                <td>{user.username}</td>
            </tr>
        {/each}
    </tbody>
</table>