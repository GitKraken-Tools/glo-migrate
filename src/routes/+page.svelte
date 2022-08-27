<script>
    import Session from "$lib/components/Session.svelte";
    import { page } from '$app/stores';

    // console.log($page);
</script>

<h1 class="font-bold text-2xl">Dashboard</h1>
<p class="font-thin text-sm mb-6">Here you will find all of your pending migrations</p>

{#each $page.data.sessions as session}
    <a sveltekit:prefetch href="/{session.id}">
        <Session {session} />
    </a>
{/each}

<a sveltekit:prefetch href="/new">
    <Session />
</a>
