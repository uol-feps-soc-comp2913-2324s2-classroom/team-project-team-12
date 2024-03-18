<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>

<script lang="ts">

    import groups from "$lib/groups.png"; 
    import compass from "$lib/compass.png"; 
    import pay from "$lib/pay.png"; 

    let scrolls = ["Journey with Us", "Payment Plans", "Contact Us", "Back to Top"];
    let currentIndex = 0;
    let text = scrolls[currentIndex];
    let flag = 0;

    function next() {
        if(text != "Back to Top"){
            currentIndex = (currentIndex + 1) % scrolls.length;
            text = scrolls[currentIndex];
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); 
        } else {
            currentIndex = 0;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            text = scrolls[currentIndex];
        }
    }

</script>
  
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background: #fff;
        height: 5000px;
    }

    body::-webkit-scrollbar {
        display: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        width: 100%;
    }

    .top-bar {
        background: linear-gradient(to right,
        #a8b6ae,
        #111111);
        color: #000;
        text-align: center;
        padding: 10px 0;
        border-radius: 100px;
        display: flex;
        justify-content: space-between;
        width: 80%;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0.25, 0.25);
    }

    .centered-text {
        flex-grow: 1;
        text-align: center;
        font-family: "Poppins";
    }

    .button {
        background: linear-gradient(135deg, #333333, #4b4b4b);
        color: #ffffff;
        padding: 20px 40px;
        border: none;
        border-radius: 100px;
        margin-right: 40px;
        cursor: pointer;
        font-family: "Poppins";
        box-shadow: 0 4px 6px rgba(0, 0, 0.25, 0.25);
        text-decoration: none;
    }

    .scroll-button {
        position: fixed;
        bottom: 20px;
        left: 50%; 
        transform: translateX(-50%); 
        background: linear-gradient(135deg, #f8e71c, #f5f5f5);
        color: #000;
        padding: 15px 30px;
        border: none;
        border-radius: 100px;
        cursor: pointer;
        font-family: "Poppins";
        box-shadow: 0 4px 6px rgba(0, 0, 0.25, 0.25);
    }
         
    .info {
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        width: 100%;
        margin-top: 100px;
    }

    .item {
        border: 1px solid #ccc; 
        padding: 20px; 
        border: none;
        text-align: center; 
    }

    .item img {
        max-width: 100%; 
        height: auto; 
        margin-bottom: 10px; 
        max-height: 300px;
    }

    .item p {
        font-size: 16px; 
        line-height: 1.5; 
        font-family: "Poppins";
    }

</style>
  
<body>
    <div class="container">
        <div class="top-bar">
            <div class="centered-text">
                <h1>Track your routes with Journeys!</h1>
            </div>
            <a href="/login" class="button">Sign In</a>
        </div>
        <div class="info">
            <div class="item">
                <img src={compass} alt="">
                <p>Compass for Precision Tracking: Stay on course with confidence! Plot your routes effortlessly using our intuitive plotting feature. Track every detail of your journey, from distance to elevation, and download comprehensive data whenever you need it. Your exploration, your data, your control</p>
            </div>
            <div class="item">
                <img src={groups} alt="">
                <p>Explore new paths with friends! Create groups, share routes, and seamlessly overlay multiple journeys on the same map. With our app, adventure becomes a shared experience.</p>
            </div>
            <div class="item">
                <img src={pay} alt="">
                <p>Unlock limitless exploration with our tailored payment options! Choose from our three payment plans - weekly, monthly, or yearly - and embark on your journey with peace of mind. Your adventure awaits, and we're here to make it accessible, affordable, and unforgettable. Join us today!</p>
            </div>
        </div>
    </div>

    <div class="container">

    </div>

    <div class="container">

    </div>

    <div class="container">

    </div>
    

    {#if text && flag != 1}
        <button class="scroll-button" on:click={() => next()}>{text}</button>
    {/if}
</body>