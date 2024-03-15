<script>
    import { writable } from 'svelte/store';

    import payment from "$lib/payment.png";
    import account from "$lib/account.png";
    import security from "$lib/security.png";
    import accessibility from "$lib/accessibility.png";
    import help from "$lib/help.png";
    import settings from "$lib/settings.png";

    let isHovered = writable(false); 
</script>

<head>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <style>
        body {
            background-color: #E5E4E4;
        }

        .sidebar-tab {
            position: fixed;
            top: 0; 
            right: 0; 
            width: 8vh; 
            height: 8vh; 
            transition: height 0.5s ease, width 0.5s ease; 
            z-index: 100;
            display: flex;
            flex-direction: column; 
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid #1c1c1c;
            border-bottom-left-radius: 25px; 
            background-color: #ffffff;
            box-shadow: 0 10px 5px -5px rgba(0, 0, 0, 0.5); 
            overflow: hidden; 
        }

        .sidebar-content {
            display: none; 
            text-align: center;
        }

        .sidebar-tab:hover .sidebar-content {
            display: block; 
            align-items: center;
        }

        .sidebar-tab:hover {
            height: 40%; 
            padding-top: 20px;
            padding-bottom: 20px;
        }

        button {
            border: none;
            background-color: transparent;
            padding: 10%; 
        }
        
        .more, .settings {
            width: 30px; 
            height: 30px;
        }

        button:hover {
            opacity: 0.5; 
        }

        .img-text {
            font-size: 10px;
            font-family: "Poppins";
            margin-bottom: 1vh;
        }
    </style>
</head>
<body>
    <div class="sidebar-tab" on:mouseenter={() => isHovered.set(true)} on:mouseleave={() => isHovered.set(false)} role="button" tabindex="0" aria-label="Settings">
    {#if !$isHovered}
        <div class="settings"><img class="settings" src={settings} alt="settings"></div>
    {/if}
    <div class="sidebar-content">
            <a href="account"><button><img class="more" src={account} alt="account"><div class="img-text">Account</div></button></a>
            <a href="payment"><button><img class="more" src={payment} alt="payment"><div class="img-text">Payments</div></button></a>
            <a href="security"><button><img class="more" src={security} alt="security"><div class="img-text">Privacy and Security</div></button></a>
            <a href="accessibility"><button><img class="more" src={accessibility} alt="accessibility"><div class="img-text">Accessibility</div></button></a>
            <a href="help"><button><img class="more" src={help} alt="help"><div class="img-text">Help</div></button></a>
        </div>
    </div>
</body>