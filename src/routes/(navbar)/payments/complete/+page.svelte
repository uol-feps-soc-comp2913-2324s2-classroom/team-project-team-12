<script>
    export let data;
</script>

<body>
    <div class="fixed top-0 left-0 -z-10 w-screen h-screen flex flex-col dark:text-white justify-center items-center">
        <h1>Checkout complete</h1>

        <p>{data.message}</p>
    </div>
</body>

<style>
    h1 {
        font-size: 225%;
    }
</style>
