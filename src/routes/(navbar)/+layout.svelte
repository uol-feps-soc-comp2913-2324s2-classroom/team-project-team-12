<script>
    import './app.css';
    import { Navbar, NavBrand, NavUl, NavLi, ToolbarButton, DarkMode, NavHamburger } from 'flowbite-svelte';
    import { GlobeSolid, ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';

    export let data;

    const logoutUser = async () => {
        const formData = new FormData();
        formData.append('type', 'logout');

        const response = await fetch('/logout', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        // if logged out, go to landing page.
        if (result.status === 200) {
            window.location = '/';
        }
    };
</script>

<Navbar class="drop-shadow">
    <NavHamburger />
    <NavBrand href="/map">
        <GlobeSolid size="lg" class="self-center whitespace-nowrap text-red-500" />
        <span class="self-center whitespace-nowrap text-2xl ml-1 font-semibold text-gray-900 dark:text-white">
            Journeys
        </span>
    </NavBrand>
    <NavUl>
        {#if data.user != undefined}
            <NavLi href="/map">Home</NavLi>
            <NavLi href="/friends">Friends</NavLi>
            <NavLi href="/groups">Groups</NavLi>
            <NavLi href="/routes">Routes</NavLi>
            <NavLi href="/payments">Pricing</NavLi>
        {/if}
    </NavUl>

    <div class="flex items-center">
        {#if data.user == undefined}
            <ToolbarButton href="/login" class="hidden font-semibold xl:inline-block" size="lg" rel="noreferrer">
                Sign In
            </ToolbarButton>
        {:else}
            <ToolbarButton
                href="/profile/{data.user}"
                class="hidden font-semibold xl:inline-block"
                size="lg"
                rel="external"
            >
                {data.user}
            </ToolbarButton>
        {/if}
        <DarkMode />
        {#if data.user}
            <ToolbarButton size="lg" on:click={logoutUser}>
                <ArrowRightToBracketOutline />
            </ToolbarButton>
        {/if}
    </div>
</Navbar>

<slot />
