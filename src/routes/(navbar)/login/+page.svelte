<script>
    import Login from './login.svelte';
    import Register from './register.svelte';
    import { Card, TabItem, Tabs } from 'flowbite-svelte';
    import { GlobeSolid } from 'flowbite-svelte-icons';
</script>

<body>
    <div class="main-container">
        <Card>
            <GlobeSolid size="xl" class="self-center whitespace-nowrap text-red-500" />
            <br>
            <Tabs style="full" tabsType="full" defaultClass="flex">
                <TabItem class="w-full" open>
                    <span slot="title">Login</span>
                    <Login />
                </TabItem>
                <TabItem class="w-full">
                    <span slot="title">Register</span>
                    <Register />
                </TabItem>
            </Tabs>
        </Card>
    </div>
</body>

<style>
    .main-container {
        width: 100%;
        height: 90vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>