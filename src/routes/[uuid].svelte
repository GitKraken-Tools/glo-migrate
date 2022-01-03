<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { getTimeRemaining } from "$lib/time";

    import Glo from "$lib/steps/Glo.svelte";
    import Boards from "$lib/steps/Boards.svelte";
    import Trello from "$lib/steps/Trello.svelte";
    import Confirmation from "$lib/steps/Confirmation.svelte";

    let session = null;
    let time = null;

    let stepIndex = 0;
    let gloPat = "pe7828f3877aa47a25972bef3ad2e5cb3210fd9ea";

    onMount(async () => {
        const res = await fetch(`/api/sessions/${$page.params.uuid}`);
        if (res.status === 400) {
            goto("/");
        }
        session = await res.json();
        time = getTimeRemaining(session.created_at);
        checkLifespan();
        window.setInterval(() => {
            time = getTimeRemaining(session.created_at);
            checkLifespan();
        }, 1000);
        console.log(session);
    });

    const checkLifespan = () => {
        if (time.minutes == 0 && time.seconds == 0) {
            goto("/");
            // delete the entry
        }
    };
</script>

{#if session}
    <h1 class="card-title">
        Glo <i class="fas fa-long-arrow-alt-right mx-3" />
        {session.target}
    </h1>
    <p class="font-thin text-accent">
        <b class="font-bold"
            ><span class="countdown">
                <span style="--value:{time.minutes};" />
            </span></b
        >
        minutes and
        <b class="font-bold"
            ><span class="countdown">
                <span style="--value:{time.seconds};" />
            </span></b
        > seconds until purge.
    </p>

    <div class="my-6 border-accent border-t" />

    <ul class="w-full steps mb-6">
        <li class="step {stepIndex >= 0 ? 'step-accent' : ''}">Glo PAT</li>
        <li class="step {stepIndex >= 1 ? 'step-accent' : ''}">
            Select Glo Board
        </li>
        <li class="step {stepIndex >= 2 ? 'step-accent' : ''}">
            {session.target} PAT
        </li>
        <li class="step {stepIndex >= 3 ? 'step-accent' : ''}">Confirmation</li>
    </ul>

    {#if stepIndex === 0}
        <Glo bind:stepIndex bind:gloPat />
    {:else if stepIndex === 1}
        <Boards bind:stepIndex bind:gloPat />
    {:else if stepIndex === 2}
        <Trello />
    {:else if stepIndex === 3}
        <Confirmation />
    {/if}
{:else}
    <i class="fas fa-cog fa-spin" />
{/if}
