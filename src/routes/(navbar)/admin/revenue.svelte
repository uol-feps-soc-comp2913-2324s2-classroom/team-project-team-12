<script lang="ts">
    import { onMount } from 'svelte';
    import type { user } from '$lib/interfaces';
    import {Select,Input} from 'flowbite-svelte';
    import { last } from 'ramda';
    let users: user[] = [];
    let chosenDate: Date = new Date();
    onMount(async () => {
        const response = await fetch('/api/getUsers');
        if (response.ok) {
                users = await response.json();
            } else {
                console.error('Failed to fetch users');
        }
        const today = new Date();
        chosenDate = today;
    });
    console.log(chosenDate + 'chosen')
    let todaysDate: Date = new Date();
    console.log(todaysDate);
    let numberOfWeeks: number = 1;
    let income: number = 0.00;
    const annualCost: number = 5.00;
    const monthlyCost: number = 0.50;
    const weeklyCost: number = 0.20;
    let toDisplay: string = "0.00";
    let subscriptionStartDate: Date;
    let before_this: Date;

    $: {
        
        numberOfWeeks, chosenDate;
        console.log(chosenDate + 'chosen')
        console.log(income);
        before_this = new Date(chosenDate);
        before_this.setDate(before_this.getDate() + (numberOfWeeks * 7));
        income = income - income;
        for (let i = 0; i <users.length; i++) {
            if (users[i].last_payment) {
                subscriptionStartDate = new Date(users[i].last_payment);
            if (users[i].membership_type === 0) {
                    while (subscriptionStartDate < todaysDate) {
                        subscriptionStartDate.setDate(subscriptionStartDate.getDate() + 7);
                    }
                    while (subscriptionStartDate < before_this) {
                        income = income + weeklyCost;
                        subscriptionStartDate.setDate(subscriptionStartDate.getDate() + 7);
                    }
            }
            else if (users[i].membership_type === 1) {
                    while (subscriptionStartDate < todaysDate) {
                        subscriptionStartDate.setMonth(subscriptionStartDate.getMonth() + 1);
                    }
                    while (subscriptionStartDate < before_this) {
                        income = income +  monthlyCost;
                        subscriptionStartDate.setMonth(subscriptionStartDate.getMonth() + 1);
                    }
            }
            else if (users[i].membership_type === 2) {
                    while (subscriptionStartDate < todaysDate) {
                        subscriptionStartDate.setFullYear(subscriptionStartDate.getFullYear() + 1);
                    }
                    while (subscriptionStartDate < before_this) {
                        income = income +  annualCost;
                        subscriptionStartDate.setFullYear(subscriptionStartDate.getFullYear() + 1);
                    }
                }
            }
        }
    }
    $: {
        toDisplay = income.toFixed(2);
    }
</script>

<Select bind:value={numberOfWeeks}>
    <option value="1">Weekly</option>
    <option value="4">Monthly</option>
    <option value="12">3 Months</option>
    <option value="24">6 Months</option>
    <option value="52">Yearly</option>
</Select>
<Input bind:value={chosenDate} type="date" min={chosenDate}/>

<h1>Revenue</h1>
<h2>Income: £{toDisplay}</h2>