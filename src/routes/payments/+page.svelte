<script>
    import Weekly from './weekly.svelte'
    import Monthly from './monthly.svelte'
    import Yearly from './yearly.svelte'

</script>

<body>
    <br>
    <h1> <center> Payment Plans </center></h1>
    <br>
    <div class="flex">
        <Weekly />
        <Monthly />
        <Yearly />
    </div>
</body>


<style>
    h1{
        font-size: 225%;
    }
    body{
        font-family: "Poppins";
    }
    .flex{
		display: flex;
		justify-content: space-evenly;
        height:100%;
	}
</style>
