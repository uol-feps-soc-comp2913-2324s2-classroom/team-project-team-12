<script>
    /**
     * @type {string}
     */
     export let plan;   

    function changePlan() {
        plan = "monthly";
    }
</script>

<div class="panel">
    <center>
        <h2>Monthly</h2>
        <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <br>
        <button class={plan === "monthly" ? 'disabled' : ''} on:click={changePlan}>
            {plan === "monthly" ? 'Current Plan' : 'Choose Plan'}
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
</style>