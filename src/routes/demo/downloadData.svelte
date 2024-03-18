<script>
    let period = 1;

    const downloadData = async () => {
        // set the period to download data from
        let currentDate = new Date();

        let startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - period);

        const formData = new FormData();
        formData.append('type', 'download');
        formData.append('start', startDate.toDateString());

        try {
            const response = await fetch('/demo', {
                method: 'POST',
                body: formData,
            });

            console.log(response);

            const result = await response.json();

            console.log(result.data);

            let data = JSON.parse(result.data);

            console.log(data);

            const blob = new Blob([data[2]], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        }
        catch (error) {

        }
    }
</script>

<form on:submit={downloadData}>
    <select bind:value={period} id="period" name="period">
        <option value=1>1 month</option>
        <option value=3>3 months</option>
        <option value=6>6 months</option>
        <option value=12>12 months</option>
    </select>
    <input type="submit" />
</form>
