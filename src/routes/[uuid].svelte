<script>
    import { onMount } from "svelte";
    import { getTimeRemaining } from "$lib/time";
    import { options } from '$lib/options';

    export let session = null;
    export let users = [];
    export let boards = [];
    export let cards = [];
    export let userIds = [];
    export let stepIndex = 0;

    let time = {};

    onMount(async () => {
        console.log({session, tokens, boards, cards, userIds});
        time = getTimeRemaining(session.createdOn);
        checkLifespan();
        let interval = window.setInterval(() => {
            time = getTimeRemaining(session.createdOn);
            checkLifespan(interval);
        }, 1000);
    });

    const checkLifespan = (interval) => {
        if (time.minutes == 0 && time.seconds == 0) {
            window.clearInterval(interval);
            goto("/");
        }
    };

    const selectBoard = async () => {
        await fetch('/api/sessions', {method: 'PUT', body: JSON.stringify(session)});
        location.reload();
    }
</script>

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
    <li class="step {stepIndex >= 0 ? 'step-accent' : ''}">Glo Auth</li>
    <li class="step {stepIndex >= 1 ? 'step-accent' : ''}">Select Glo Board</li>
    <li class="step {stepIndex >= 2 ? 'step-accent' : ''}">Link Users</li>
    <li class="step {stepIndex >= 3 ? 'step-accent' : ''}">Confirmation</li>
</ul>

{#if stepIndex === 0}
    <a target="_blank" class="btn btn-accent" href="/api/gitkraken/oauth?uuid={session.uuid}">
        <i class="fab fa-gitkraken mr-2" /> Authorize Glo
    </a>
{:else if stepIndex === 1}
    <select bind:value={session.sourceId} class="select select-accent mb-6">
        <option disabled selected value={null}>Select board to migrate</option>
        {#each boards as board}
            <option value={board.id}>{board.name}</option>
        {/each}
    </select>
    <button on:click={() => selectBoard()} class="btn btn-accent">Select</button>
{:else if stepIndex === 2}
    <table class="table">
        <tr>
            <th>Username</th>
            <th>ID</th>
            <th>Actions</th>
        </tr>
        <!-- {#each tokens.filter(i => i.type === 'GitKraken') as token}
            <tr>
                <td>{token.principal.username}</td>
                <td>{token.principal.id}</td>
                <td>
                    {#each options.filter(i => i.label === session.target) as option}
                        <button
                            on:click={() => link(option.label)} class="btn btn-sm text-white bg-accent flex-1">
                            <i class="{option.icon} mr-3" />
                            Link {option.label}
                        </button>
                    {/each}
                </td>
            </tr>
        {/each} -->
    </table>
    <button>
        <p>{tokens.filter(i => i.type === 'GitKraken').length} out of {userIds.length} users</p>
    </button>
{:else if stepIndex === 3}
    <button on:click={() => launch()} class="btn btn-accent"
        >Migrate to {session.target}</button
    >
{/if}
