<script>
    import Login from './login.svelte';
    import Register from './register.svelte';
    import { Card, Button } from 'flowbite-svelte';

    let state = "login";
    let transition;
    let sliderLeft = 100;
    let formLeft = 0;

    function loginClicked() {
        if (state == "register"){
            state = "login";
            transition = true;
            sliderLeft = 100;
            formLeft = 0;
        }else{
            transition=false;
        }
    }

    function registerClicked() {
        if (state == "login"){
            transition = true;
            state = "register"
            sliderLeft = 250;
            formLeft = -513;
        }else{
            transition=false;
        }
    }
</script>

<main>
    <body>
    <div class="container">
        <Card>
            <div class="slider" style="left: {sliderLeft}px;"></div>
            <div class="btn">
                <Button style="background-color: transparent; border-color: transparent;" color="light" on:click={loginClicked}>Login</Button>
                <Button color="light" style="background-color: transparent; border-color: transparent;" on:click={registerClicked}>Signup</Button>
            </div>
            <div class="form-section m0" style="left: {formLeft}px;">
                <Login />
                <Register />
            </div>
        </Card>
    </div>
</body>
</main>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Make the body take the full viewport height */
        margin: 0; /* Remove default body margin */
        background-color: #f0f0f0; /* Set a background color if needed */
    }

    .container {
        height: 90%;
        width: 40%;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn{
        height: 70%;
        width: 80%;
        margin: 20px auto;
        box-shadow: 10px 10px 30px #a8b6ae;
        border-radius: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1;
    }

    .slider {
        height: 40px;
        width: 120px;
        border-radius: 50px;
        background-image: linear-gradient(to right,
        #a8b6ae,#7a8c82);
        z-index:0;
        position: absolute;
        top: 10px;
        transition: all 0.5s ease-in-out;
    }

    .form-section {
        height: 100%;
        width: 300%;
        padding: 10px 0;
        display: flex;
        position: relative;
        transition: all 0.5s ease-in-out;
        left: 0px;
    }
</style>