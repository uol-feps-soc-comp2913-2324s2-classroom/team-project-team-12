<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>

<script lang="ts">
    import { DeviceMockup, Heading, P, Hr, Card, Button, Badge, GradientButton } from 'flowbite-svelte';
    import { Footer, FooterCopyright } from 'flowbite-svelte';
    import { CheckCircleSolid } from 'flowbite-svelte-icons';
    import light from "$lib/screen1.png";
    import dark from "$lib/screen2.png";
    import lightm from "$lib/mobile1.png";
    import darkm from "$lib/mobile2.png";
</script>
  
<style>
    body {
        margin: 0;
        padding: 0;
        height: 275vh;
    }

    :global(body::-webkit-scrollbar) {
        display: none;
    }

    .container {
        width: 70%;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
    
    .heading {
        margin-top: 10vh;      
    }
    
    .subheading {
        font-family: 'Poppins', sans-serif;
        font-size: 1.2rem;
        margin-bottom: 30px;
        text-align: center;
        align-items: center;
        justify-content: center;
        display: flex;
    }
    
    .device-container {
        justify-content: center;
        margin-top: 100px;
    }

    .feature-container {
        display: flex;
        justify-content: space-between;
        margin-top: 200px;
    }
    
    .feature {
        flex: 0 1 80%; 
        margin-bottom: 30px;
        text-align: left;
    }
    
    .feature h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
        color: #333; 
        margin-bottom: 10px;
    }
    
    .feature p {
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        color: #666;
    }

    .payments{
        display: flex;
        justify-content: space-between;
        margin-top: 18%;
        margin-bottom: 10%;
    }

    .mobile {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 15%;
        margin-bottom: 15%;
        flex-direction: row;
    }
    
    .text-container {
        width: 40%;
    }

</style>

<body class="bg-white dark:bg-gray-900">
    <div class="container">
        <div class="heading"><Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Start your journey!</Heading></div>        
        <div class="subheading"><P color="text-gray-500 dark:text-gray-400">Welcome to the ultimate route tracking experience.</P></div>
        
        <div class="device-container">
            <DeviceMockup device="laptop">
                <img src={dark} class="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt="laptop example 2" />
                <img src={light} class="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl" alt="laptop example 1" />
            </DeviceMockup>
        </div>
        
        <div class="feature-container">
            <div class="feature">
                <Heading tag="h3" class="mb-4">Track Your Activities</Heading>
                <P color="text-gray-500 dark:text-gray-400">Record your runs, rides, and workouts with GPS tracking.</P>
            </div>
            
            <div class="feature">
                <Heading tag="h3" class="mb-4">Collaborate</Heading>
                <P color="text-gray-500 dark:text-gray-400">Create groups and view shared routes.</P>
            </div>

            <div class="feature">
                <Heading tag="h3" class="mb-4">Socialise</Heading>
                <P color="text-gray-500 dark:text-gray-400">Connect with friends and share your fitness journey with them.</P>
            </div>
        </div>   
        <Hr classHr="my-8" />

        <div class="heading"><Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Payment Plans...</Heading></div>     

        <div class="payments">

            <Card padding="xl">
                <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Weekly Plan</h5>
                <div class="flex items-baseline text-gray-900 dark:text-white">
                <span class="text-3xl font-semibold">£</span>
                <span class="text-5xl font-extrabold tracking-tight">2.59</span>
                <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/week</span>
                </div>
                <ul class="my-7 space-y-4">
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Upload and store GPS route data. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Display GPS route data on a map. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Switch payment type whenever. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Ability to add friends and create groups.</span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">View shared data on a map.</span>
                    </li>
                </ul>
                <Button class="w-full"  href="login">Choose plan</Button>
            </Card>

            <Card padding="xl">
                <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Monthly plan</h5>
                <div class="flex items-baseline text-gray-900 dark:text-white">
                <span class="text-3xl font-semibold">£</span>
                <span class="text-5xl font-extrabold tracking-tight">12.59</span>
                <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul class="my-7 space-y-4">
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Upload and store GPS route data. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Display GPS route data on a map. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Switch payment type whenever. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Ability to add friends and create groups.</span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">View shared data on a map.</span>
                    </li>
                </ul>
                <Button class="w-full"  href="login">Choose plan</Button>
            </Card>

            <Card padding="xl">
                <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Yearly Plan
                    <Badge class="text-2xl font-semibold ms-2">PRO</Badge>
                </h5>
                <div class="flex items-baseline text-gray-900 dark:text-white">
                <span class="text-3xl font-semibold">£</span>
                <span class="text-5xl font-extrabold tracking-tight">100</span>
                <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/year</span>
                </div>
                <ul class="my-7 space-y-4">
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Upload and store GPS route data. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Display GPS route data on a map. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"> Switch payment type whenever. </span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Ability to add friends and create groups.</span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">View shared data on a map.</span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">One yearly payment.</span>
                    </li>
                    <li class="flex space-x-2 rtl:space-x-reverse">
                        <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Save over <b>£50!</b></span>
                    </li>
                </ul>
                <GradientButton class="w-full" color="pinkToOrange"  href="login">Choose plan</GradientButton>
            </Card>
        </div>

        <Hr classHr="my-8" />

        <div class="heading"><Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Access journeys on the go!</Heading></div>  
        <div class="subheading"><P color="text-gray-500 dark:text-gray-400">Available in the App Store and Google Play.</P></div>

        <div class="mobile">
            <DeviceMockup device="ios">
                <img src={lightm} class="dark:hidden w-[272px] h-[572px]" alt="laptop example 2" />
                <img src={darkm} class="hidden dark:block w-[272px] h-[572px]" alt="laptop example 1" />
            </DeviceMockup>
            <div class= "text-container">
                <P color="text-gray-500 dark:text-gray-400">Plan your routes on the fly with our route plotting app, now available on 
                    <strong class="font-semibold text-gray-900 dark:text-white"> iOS and Android. </strong> 
                    Whether you're on your desktop or on the move, our app ensures that your routes are always accessible, wherever your travels take you. Download now and start exploring!</P>
            </div>
        </div>

        <Hr classHr="my-8" />
    </div>

    <Footer>
        <FooterCopyright href="/" by="Journeys™" year={2024} />
    </Footer>

</body>