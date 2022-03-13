<script>
    import { goto } from "$app/navigation";
import Session from "$lib/components/Session.svelte";

    const connect = async (target) => {
        const session = await fetch('/api/sessions', {method: 'POST', body: JSON.stringify({target})}).then(i => i.json());
        window.location.href = `/api/gitkraken/oauth?uuid=${session.uuid}`
        console.log(session);
    } 
</script>

<h1 class="font-bold text-2xl">Dashboard</h1>

<p class="font-thin text-gray-400 mb-6">Welcome, <span class="text-primary">Kyjus25</span>! 👋</p>

<p class="font-thin text-sm mb-6">Here you will find all of the pending migrations that you are involved in.</p>

<Session session={true} />
<Session />

<a href="/new">
    <button class="bg-primary hover:opacity-80 text-white p-3 rounded-md w-full mt-6">
        <i class="fas fa-rocket" />
        Continue
    </button>
</a>


