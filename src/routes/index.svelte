<script>
    import { goto } from "$app/navigation";

    const connect = async (target) => {
        const session = await fetch('/api/sessions', {method: 'POST', body: JSON.stringify({target})}).then(i => i.json());
        window.location.href = `/api/gitkraken/oauth?uuid=${session.uuid}`
        console.log(session);
    } 
</script>

<h1 class="text-white font-bold text-xl mb-3">Welcome to the Glo Migrator</h1>
<p class="font-light">
    This tool will migrate your Glo board to a different platform.
</p>
<p class="font-light">
    When you are ready, connect GitKraken and select the board you'd like to migrate
</p>

<button on:click={() => connect()} class="bg-primary hover:opacity-80 text-white p-3 rounded-md w-full mt-6">
    <i class="fab fa-gitkraken" />
    Connect GitKraken
</button>


