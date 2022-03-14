<script>
    import { session } from '$app/stores';
    import { onMount } from 'svelte';

    onMount(() => {
        console.log($session);
    });
    
</script>

{#if $session.gitkrakenUsername}
    <div class="font-thin text-gray-400 absolute top-3 right-3 text-right">
        <p>Welcome, <span class="text-primary">{$session.gitkrakenUsername}</span>! 👋</p>
        <a class="text-gray-400 hover:text-white text-xs mr-3" href="/">Dashboard</a>
        <a class="text-gray-400 hover:text-white text-xs" href="/login">Log Out</a>
    </div>
{/if}

<div class="flex items-center content-center h-screen w-screen">
    <div class="mx-auto w-[600px] -mt-36 p-6">
        <div>
            <img src="/gitkraken_glo.png" alt="logo" class="w-20 m-6 mx-auto" />
        </div>
        <div class="bg-foreground p-5 rounded-md shadow-lg">
            <div class="card-body">
                <slot />
            </div>
        </div>
    </div>
</div>

<style global>
    @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap");
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
