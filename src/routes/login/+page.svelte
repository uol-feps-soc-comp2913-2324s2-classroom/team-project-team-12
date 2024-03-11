<script>
    import Login from './login.svelte';
    import Register from './register.svelte';

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
            formLeft = -500;
        }else{
            transition=false;
        }
    }
</script>

<body>
    <div class="container">
        <div class="slider" style="left: {sliderLeft}px;"></div>
        <div class="btn">
            <button class="login" on:click={loginClicked}>Login</button>
            <button class="register" on:click={registerClicked}>Signup</button>
        </div>
        <div class="form-section" style="left: {formLeft}px;">
            <Login />
            <Register />
        </div>
    </div>
</body>

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
        height: 650px;
        width: 500px;
        margin: auto auto;
        background-color: white;
        box-shadow: 8px 8px 20px #a8b6ae;
        border-radius: 50px;
        position: relative;
        overflow: hidden;
    }

    .btn{
        height: 60px;
        width: 300px;
        margin: 20px auto;
        box-shadow: 10px 10px 30px #a8b6ae;
        border-radius: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .login, .register{
        font-size: 1.2em;
        border: none;
        outline: none;
        background-color: transparent;
        position: relative;
        cursor: pointer;
    }

    .slider {
        height: 60px;
        width: 150px;
        border-radius: 50px;
        background-image: linear-gradient(to right,
        #a8b6ae,
                #7a8c82);
        position: absolute;
        top: 20px;
        left: 100px;
        transition: all 0.5s ease-in-out;
    }

    .form-section {
        height: 500px;
        width: 1000px;
        padding: 20px 0;
        display: flex;
        position: relative;
        transition: all 0.5s ease-in-out;
        left: 0px;
    }
</style>