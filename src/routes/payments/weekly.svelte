<script lang="ts">
    let registerMessage = ""
    
    export let plan:string;
    
    const handleUpdate = async () => {
        try {
            const response = await fetch('?/update', {
                method: 'POST',
                body: '0',
            });

            plan = 'weekly';

        } catch (error) {
            console.error('Error during update:', error);
            registerMessage = 'Internal Server Error';
        }
    }
</script>

<div class={plan === 'weekly' ? 'panel active' : 'panel'}>
    <center>
        <h2>Weekly</h2>
        <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <br>
        <button class={plan === 'weekly' ? 'disabled' : ''} on:click={handleUpdate}>
            {plan === 'weekly' ? 'Current Plan' : 'Choose Plan'}
        </button>
    </center>
</div>

<style>
    button{
        font-family: "Poppins";
        font-size: 100%;
        font-weight: bold;
        border-radius: 12px;
        border: 1px solid;
        background-color: lavender;
        padding: 5% 10%;
    }
    button:hover{
        background-color:rgb(241, 241, 255);
    }
    button:active{
        background-color: rgb(210, 210, 230);
    }
    .panel{
        border-radius: 25px;
        border: 2px solid black;
        padding: 1%;
        width: 15%;
        height: 100%;
    }
    .disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .active {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>