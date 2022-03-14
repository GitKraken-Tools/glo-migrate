<script>
    import { clearCookie } from '$lib/cookies';
    import { onMount } from 'svelte';

    onMount(() => {
        clearCookie('gitKrakenId');
    });
</script>

<h1 class="font-bold text-2xl mb-6">Account Login</h1>

<p class="font-thin text-sm">Welcome! Glo Migrator uses GitKraken accounts to sign in.</p>

<a href="/api/gitkraken/oauth">
    <button class="bg-primary hover:opacity-80 text-white p-3 rounded-md w-full mt-6">
        <i class="fab fa-gitkraken" />
        Connect GitKraken
    </button>
</a>
