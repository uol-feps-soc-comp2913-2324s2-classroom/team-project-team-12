<script>
    let username = '';
    let password = '';
    import { goto } from '$app/navigation';
    import { Button, Input } from 'flowbite-svelte';

    let loginMessage = '';

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('type', 'login');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200) {
                console.log(result.message || 'Login successful');
                goto('/map');
            } else {
                console.error(result.message || 'Login failed');
            }

        } catch (error) {
            console.error('Error during login:', error);
            loginMessage = 'Internal Server Error';
        }
    };
</script>

<div class="form-section">
    <form class="flex flex-col space-y-6" name="login" method="post" on:submit|preventDefault={handleLogin}>
        <Input type="hidden" name="type" value="login"/>
        <div class="login-box">
            <Input  
                bind:value={username}
                type = "text"
                name = "username"
                placeholder = "Enter username"
                required
            />
            <Input
                bind:value={password}
                type="password"
                name = "password"
                placeholder = "Enter password"
                required
            />
            <Button color="green" class="mt-4" type="submit">Submit</Button>
        </div>
    </form>
</div>

<style>
 
    .form-section {
        height: 100%;
        width: 100%;
        padding: 20px 0;
        display: flex;
        position: relative;
        transition: all 0.5s ease-in-out;
        left: 0px;
    }
    
    .login-box {
        height: 100%;
        width: 200%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0px 10px;
        gap: 30px;
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


