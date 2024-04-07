<script>
    import './app.css';
    import { Navbar, NavBrand, NavUl, NavLi, ToolbarButton, DarkMode, NavHamburger } from 'flowbite-svelte';
    import { GlobeSolid } from 'flowbite-svelte-icons';

    export let data;
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
        <NavLi href="/map">Home</NavLi>
        <NavLi href="/friends">Friends</NavLi>
        <NavLi href="/groups">Groups</NavLi>
        <NavLi href="/routes">Routes</NavLi>
        <NavLi href="/payments">Pricing</NavLi>

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
                rel="noreferrer"
            >
                {data.user}
            </ToolbarButton>
        {/if}
        <DarkMode />
    </div>
</Navbar>

<slot />
