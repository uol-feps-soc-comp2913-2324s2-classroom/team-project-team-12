<script lang="ts">
    import { onMount } from 'svelte';
    import type { user } from '$lib/interfaces';
    import {
        Select,
        Input,
        Table,
        TableHead,
        TableHeadCell,
        TableSearch,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        P,
        Heading,
        Hr
    } from 'flowbite-svelte';
    let users: user[] = [];
    let chosenDate: Date = new Date();
    onMount(async () => {
        const response = await fetch('/api/getUsers');
        if (response.ok) {
            users = await response.json();
        } else {
            console.error('Failed to fetch users');
        }
    });
    //console.log(chosenDate + 'chosen');
    let todaysDate: Date = new Date();
    //console.log(todaysDate);

    let numberOfWeeks: number = 1;
    let numberOfMonths: number = 0;
    let numberOfYears: number = 0;

    let income: number = 0.0;

    const annualCost: number = 45.00; //membership_type value of 2
    const monthlyCost: number = 5.00; //membership_type value of 1
    const weeklyCost: number = 1.50; //membership_type value of 0

    let weeklyString = weeklyCost.toFixed(2);
    let monthlyString = monthlyCost.toFixed(2);
    let annualString = annualCost.toFixed(2);

    let toDisplay: string = '0.00';
    let subscriptionStartDate: Date;

    let weekly_before_this: Date = new Date();
    let monthly_before_this: Date = new Date();
    let yearly_before_this: Date = new Date();

    let weeklys: number = 0;
    let monthlys: number = 0;
    let yearlys: number = 0;

    $: {
        numberOfWeeks, chosenDate;
        weeklys = 0;
        monthlys = 0;
        yearlys = 0;
        const chosenDateObj = new Date(chosenDate);
        numberOfMonths = Math.floor(numberOfWeeks / 4.345);
        numberOfYears = Math.floor(numberOfWeeks / 52.142);
        weekly_before_this = new Date(chosenDateObj);
        weekly_before_this.setDate(chosenDateObj.getDate() + numberOfWeeks * 7);

        monthly_before_this = new Date(chosenDateObj);
        monthly_before_this.setMonth(chosenDateObj.getMonth() + numberOfMonths);

        yearly_before_this = new Date(chosenDateObj);
        yearly_before_this.setFullYear(chosenDateObj.getFullYear() + numberOfYears);
        income = +0.0;

        for (let i = 0; i < users.length; i++) {
            if (users[i].subscription_id != 'undefined' || users[i].subscription_id != '') {
                subscriptionStartDate = new Date(users[i].subscription_start_date);
                if (users[i].membership_type == 0) {
                    if (subscriptionStartDate <= chosenDateObj) {
                        income += weeklyCost * Math.floor(numberOfWeeks);
                        weeklys = weeklys + Math.floor(numberOfWeeks);
                    }
                } else if (users[i].membership_type == 1) {
                    //console.log('number of months ' + numberOfMonths);
                    //console.log('user: ', users[i].username);
                    income += monthlyCost * Math.floor(numberOfMonths);
                    monthlys = monthlys + Math.floor(numberOfMonths);
                } else if (users[i].membership_type == 2) {
                    income += annualCost * Math.floor(numberOfYears);
                    yearlys = yearlys + Math.floor(numberOfYears);
                }
            }
        }
        toDisplay = income.toFixed(2);
        weeklyString = weeklyCost.toFixed(2);
        monthlyString = monthlyCost.toFixed(2);
        annualString = annualCost.toFixed(2);
    }
</script>
<Heading tag="h2">Revenue</Heading>
<Hr />
<div class="optionBox">
<Select bind:value={numberOfWeeks}>
    <option value="1.0000">Weekly</option>
    <option value="4.3453">Monthly</option>
    <option value="13.0357">3 Months</option>
    <option value="26.0715">6 Months</option>
    <option value="52.1429">Yearly</option>
</Select>
<Input bind:value={chosenDate} type="date" min={todaysDate} />
</div>
<Heading tag="h3">Income: £{toDisplay}</Heading>
<Table>
    <TableHead>
        <TableHeadCell>Subscription Type</TableHeadCell>
        <TableHeadCell>Number of Subscriptions</TableHeadCell>
        <TableHeadCell>Price</TableHeadCell>
        <TableHeadCell>Income</TableHeadCell>
    </TableHead>
    <TableBody>
        <TableBodyRow>
            <TableBodyCell>Weekly</TableBodyCell>
            <TableBodyCell>{weeklys}</TableBodyCell>
            <TableBodyCell>£{weeklyString}</TableBodyCell>
            <TableBodyCell>£{weeklys * weeklyCost}</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Monthly</TableBodyCell>
            <TableBodyCell>{monthlys}</TableBodyCell>
            <TableBodyCell>£{monthlyString}</TableBodyCell>
            <TableBodyCell>£{monthlys * monthlyCost}</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Yearly</TableBodyCell>
            <TableBodyCell>{yearlys}</TableBodyCell>
            <TableBodyCell>£{annualString}</TableBodyCell>
            <TableBodyCell>£{yearlys * annualCost}</TableBodyCell>
        </TableBodyRow>
    </TableBody>
</Table>

<style>
    .optionBox {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .optionBox > * {
        width: 48%;
    }
</style>