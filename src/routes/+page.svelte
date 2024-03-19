<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>

<script lang="ts">

    import groups from "$lib/groups.png"; 
    import compass from "$lib/compass.png"; 
    import pay from "$lib/pay.png"; 

    let scrolls = ["Journey with Us", "Payment Plans", "Begin Your Journey"];
    let currentIndex = 0;
    let text = scrolls[currentIndex];
    let flag = 0;

    function next() {
        if(text != "Begin Your Journey"){
            currentIndex = (currentIndex + 1) % scrolls.length;
            text = scrolls[currentIndex];
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); 
        } else {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); 
            flag = 1;
        }
    }

</script>
  
<style>

    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background: #303030; /* Dark background */
        color: #e0e0e0; /* Light gray text */
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

    .container2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
        background-color: #222;
    }

    .container3 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
    }

    .container4 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
    }

    .top-bar {
        background: linear-gradient(to right, #333, #111); /* Gradient background */
        color: #e0e0e0; /* Light gray text */
        text-align: center;
        padding: 10px 0;
        border-radius: 100px;
        display: flex;
        justify-content: space-between;
        width: 80%;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        margin-top: 30px;
    }

    .centered-text {
        flex-grow: 1;
        text-align: center;
        font-family: "Poppins";
    }

    .footer {
        background-color: #222; /* Darker background for footer */
        width: 100%;
        height: 33.33vh; /* One third of viewport height */
        position: static; /* Position relative to the container */
        margin-bottom: 0;
        left: 0;
        text-align: center;
        color: #bbb; /* Light gray text */
        margin-top: auto;
    }

    .button {
        background: linear-gradient(to right, #4d4c4c, #7c7c7c); /* Dark gradient background for button */
        color: #ffffff; /* Light gray text */
        padding: 20px 40px;
        border: none;
        border-radius: 100px;
        margin-right: 40px;
        cursor: pointer;
        font-family: "Poppins";
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        text-decoration: none;
    }

    .button2 {
        background: linear-gradient(to right, #4d4c4c, #7c7c7c); /* Dark gradient background for button */
        color: #e0e0e0; /* Light gray text */
        padding: 20px 40px;
        margin-top: 100px;
        border-radius: 100px;
        cursor: pointer;
        font-family: "Poppins";
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        text-decoration: none;
    }

    .scroll-button {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(to right, #424242, #303030); /* Dark gradient background for button */
        color: #e0e0e0; /* Light gray text */
        padding: 15px 30px;
        border: none;
        border-radius: 100px;
        cursor: pointer;
        font-family: "Poppins";
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
    }

    .info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        margin-top: 100px;
    }

    .item {
        border: 1px solid #666; /* Darker border */
        padding: 20px;
        border: none;
        text-align: center;
    }

    .item img {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
        max-height: 300px;
        padding: 30px;
    }

    .item p {
        font-size: 16px;
        line-height: 1.5;
        font-family: "Poppins";
    }

    .text {
        margin-top: 20px;
        margin-bottom: 150px;
    }
    
    .payment-plans {
        display: flex;
        justify-content: space-between;
    }

    .plan {
        background-color: #444;
        padding: 50px;
        border-radius: 30px;
        text-align: center;
        width: 30%;
        margin: 30px;
    }

    .plan h2 {
        color: #fff;
        font-size: 24px;
        margin-bottom: 10px;
        font-family: "Poppins";
    }

    .plan p {
        font-family: "Poppins";
        color: #ccc;
        margin-bottom: 10px;
    }

    .pro-plan {
        background: linear-gradient(#8f8f8f, #292929);
        padding: 50px;
        border-radius: 30px;
        text-align: center;
        width: 30%;
        margin: 30px;
        border: 2px solid #ffffff;
    }

    .pro-plan h2 {
        color: #ffffff;
        font-size: 24px;
        margin-bottom: 10px;
        font-family: "Poppins";
    }

    .pro-plan p {
        font-family: "Poppins";
        color: #ffffff;
        margin-bottom: 10px;
    }

    .plan .button3  {
        margin-top: 20px;
        font-family: "Poppins";
        background: linear-gradient(to right, #4d4c4c, #7c7c7c);
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        text-decoration: none;
        transition: background-color 0.3s ease;
        display: inline-block; 
    }

    .pro-plan .button3  {
        margin-top: 20px;
        font-family: "Poppins";
        background: linear-gradient(to right, #4d4c4c, #7c7c7c);
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: "Poppins";
        text-decoration: none;
        transition: background-color 0.3s ease;
        display: inline-block; 
    }


    .plan .button3:hover {
        background: linear-gradient(to right, #666, #4d4c4c);
    }

    .pro-plan .button3:hover {
        background: linear-gradient(to right, #666, #4d4c4c);
    }

    .bonus{
        color: #ffffff;
        font-family: "Poppins";
        font-weight: bold;
        text-decoration: underline;
        margin-bottom: 10px;
    }

    .ready {
        color: #ffffff;
        font-family: "Poppins";
        font-size: 40px;
        margin: 50px;
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
    </div>

    <div class="container2">
        <div class="info">
            <div class="item">
                <img src={compass} alt="">
                <p>Stay on course with confidence! Plot your routes effortlessly using our intuitive plotting feature. Track every detail of your journey, from distance to elevation, and download comprehensive data whenever you need it. Your exploration, your data, your control</p>
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

    <div class="container3">
        <div class="payment-plans">
            <div class="plan">
                <h2>Weekly Plan</h2>
                <p>£2.59/wk</p>
                <p>Access to all features</p>
                <a href="/login" class="button3">Subscribe</a>
            </div>
            <div class="plan">
                <h2>Monthly Plan</h2>
                <p>£10/mo</p>
                <p>Access to all features</p>
                <a href="/login" class="button3">Subscribe</a>
            </div>
            <div class="pro-plan">
                <h2>Yearly Plan</h2>
                <p>£100/yr</p>
                <div class="bonus">Save £20/yr</div>       
                <p>Access to all features</p>
                <a href="/login" class="button3">Subscribe</a>
            </div>
        </div>
    </div>

    {#if text && flag != 1}
        <button class="scroll-button" on:click={() => next()}>{text}</button>
    {/if}

    <div class="container4">
        <div class="ready">Are you ready to start your journey?</div>
        <a href="/login" class="button2">Start your journey!</a>
        <div class="footer">
            <p class="text">&copy; Journeys 2024</p>
        </div>
    </div>
</body>