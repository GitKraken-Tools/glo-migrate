<script>
    import { goto } from "$app/navigation";
    import Session from "$lib/components/Session.svelte";

    export let sessions = [];

    console.log(sessions);
</script>

<h1 class="font-bold text-2xl">Dashboard</h1>

<p class="font-thin text-sm mb-6">Here you will find all of your pending migrations</p>

{#each sessions as session}
    <a href="/{session.uuid}">
        <Session {session} />
    </a>
{/each}

<a href="/new">
    <Session />
</a>


