<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>

<script lang="ts">
    import { DeviceMockup } from 'flowbite-svelte';
</script>
  
<style>
    body {
        margin: 0;
        padding: 0;
    }

    .container {
        width: 70%;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
    
    .heading {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
        font-weight: bold;
        color: #333; /* Adjust color as needed */
        margin-bottom: 20px;
        margin-top: 10vh;
    }
    
    .subheading {
        font-family: 'Poppins', sans-serif;
        font-size: 1.2rem;
        color: #666; /* Adjust color as needed */
        margin-bottom: 30px;
    }
    
    .device-container {
        justify-content: center;
        margin-bottom: 30px;
    }

    .feature-container {
        display: flex;
        justify-content: space-between;
        margin-top: 60px;
    }
    
    .feature {
        flex: 0 1 80%; /* Adjust width as needed */
        margin-bottom: 30px;
        text-align: left;
    }
    
    .feature h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
        color: #333; /* Adjust color as needed */
        margin-bottom: 10px;
    }
    
    .feature p {
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        color: #666; /* Adjust color as needed */
    }
</style>

<body class="bg-blue dark:bg-gray-800">
    <div class="container">
        <div class="heading">Start your Journey!</div>
        <div class="subheading">Welcome to the ultimate route tracking experience</div>
        
        <div class="device-container">
            <DeviceMockup device="laptop">
                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen.png" class="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl" alt="laptop example 1" />
                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen-dark.png" class="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt="laptop example 2" />
            </DeviceMockup>
        </div>
        
        <div class="feature-container">
            <div class="feature">
                <h3>Track Your Activities</h3>
                <p>Record your runs, rides, and workouts with GPS tracking.</p>
            </div>
            
            <div class="feature">
                <h3>Socialise</h3>
                <p>Create routes for your group activities and events.</p>
            </div>

            <div class="feature">
                <h3>Another Feature</h3>
                <p>Connect with friends and share your fitness journey with them.</p>
            </div>
        </div>
           
    </div>
</body>