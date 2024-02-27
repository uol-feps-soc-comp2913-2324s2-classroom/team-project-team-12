<script>
    import { goto } from '$app/navigation';
    let registerMessage = ""

    let user = '';
    let password = '';
    let fname = '';
    let lname = '';
    let email = '';
    let confirmPassword = '';

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            registerMessage = "Passwords do not match";
            return;
        }
        const formData = new FormData();
        formData.append('type', 'register');
        formData.append('username', user);
        formData.append('password', password);
        formData.append('firstname', fname);
        formData.append('lastname', lname);
        formData.append('email', email);

        try {
        const response = await fetch('/login', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            registerMessage = result.message || 'Registration successful';
            // If registration is successful, navigate to the payments
            // at the moment this doesn't go to payments because i havent pulled that yet
            // and if it can't find payments, it won't commit to database
            goto('/');
        } else {
            registerMessage = result.message || 'Invalid username or password';
        }
        } catch (error) {
            console.error('Error during login:', error);
            registerMessage = 'Internal Server Error';
        }
    };

</script>

<div class="form-section">
    <form name="register" method="post" on:submit|preventDefault={handleRegister}>
        <div class="register-box">
            <input type="hidden" name="type" value="register">
            <input type="text"
                bind:value={fname}
                class="name ele"
                placeholder="First name"
                name="firstname">
            <input type="text"
                bind:value={lname}
                class="name ele"
                placeholder="Last name"
                name="lastname">
            <input type="text"
                bind:value={user}
                class="name ele"
                placeholder="Username"
                name="username">
            <input type="email"
                bind:value={email}
                class="email ele"
                placeholder="youremail@email.com"
                name="email">
            <input type="password"
                bind:value={password}
                class="password ele"
                placeholder="Password"
                name="password">
            <input type="password"
                bind:value={confirmPassword}
                class="password ele"
                placeholder="Confirm password">
            <input type="submit"
                class="clkbtn">
            <!-- if confirm password and password field don't match on submit -->
            {#if registerMessage}
                <p>{registerMessage}</p>
            {/if}
        </div>
    </form>
    
</div>

<style>
    .register-box {
        height: 100%;
        width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;
    }

    .form-section {
        height: 500px;
        width: 500px;
        padding: 20px 0;
        display: flex;
        position: relative;
        transition: all 0.5s ease-in-out;
        left: 0px;
    }

    .ele {
        height: 60px;
        width: 400px;
        outline: none;
        border: none;
        color: rgb(77, 77, 77);
        background-color: rgb(240, 240, 240);
        border-radius: 50px;
        padding-left: 30px;
        font-size: 18px;
    }
    
    .clkbtn {
        height: 60px;
        width: 150px;
        border-radius: 50px;
        background-image: linear-gradient(to right,
        #a8b6ae,
        #7a8c82);
        font-size: 22px;
        border: none;
        cursor: pointer;
    }
</style>