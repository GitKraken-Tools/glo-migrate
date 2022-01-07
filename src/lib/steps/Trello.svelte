<script>
    import { onMount } from "svelte";
    import {
        boards,
        mapData,
        cards,
        fetchBoards,
        fetchCards,
    } from "$lib/stores";
    export let stepIndex;
    export let boardId;
    export let session;

    let users = [];

    onMount(async () => {
        console.log("boardId", boardId);
        await fetchBoards(session);
        await fetchCards(session, boardId);
        const board = $boards.find((i) => i.id === boardId);
        const data = mapData(board, $cards, session.users);
        data.columns
            .flatMap((i) => i.cards.flatMap((j) => j.created_by))
            .forEach((i) => {
                users[i.id] = session.users.find((j) => i.id === j.id);
            });

        console.log("USERS", users);
    });

    const copy = async () => {
        var url = `http://localhost:3000/${session.uuid}`;
        await navigator.clipboard.writeText(url);
    };

    const genTrello = (gloId) => {
        const url = `/api/oauth/trello-gen?uuid=${session.uuid}&gloId=${gloId}`;
        window.location.href = url;
    };
</script>

<p class="mt-3 mb-6">
    <b>Authenticated Users:</b>
    {session.users.filter((i) => i[session.target] && i[session.target] !== "")
        .length}/{Object.keys(users).length}
</p>

<div class="mb-6">
    {#each Object.keys(users) as user}
        {#if users[user] && users[user].username}
            {#if users[user][session.target]}
                <i class="fas fa-check text-success" />
            {:else}
                <i class="fas fa-times text-error" />
            {/if}

            {users[user].username}

            {#if !users[user][session.target]}
                <button
                    on:click={() => genTrello(users[user].id)}
                    class="btn btn-sm btn-success text-white inline-block"
                >
                    <i class="fab fa-trello mr-2" /> I'm {users[user].username},
                    connect to {session.target}
                </button>
            {/if}
        {/if}
    {/each}
</div>

<div class="flex gap-6">
    <button
        on:click={() => (stepIndex = stepIndex + 1)}
        class="btn btn-accent mb-3 flex-1">Connect My User</button
    >

    <button on:click={() => copy()} class="btn btn-accent mb-3 flex-1"
        >Copy Link</button
    >

    <button
        on:click={() => (stepIndex = stepIndex + 1)}
        class="btn btn-warning mb-3 flex-1">Continue Solo</button
    >
</div>
