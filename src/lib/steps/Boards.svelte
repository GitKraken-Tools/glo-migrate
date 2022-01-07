<script>
    import { onMount } from "svelte";
    import { fetchBoards, boards } from "$lib/stores";

    export let stepIndex;
    export let session;
    export let boardId;

    onMount(async () => {
        fetchBoards(session);
    });

    const setBoard = async () => {
        const newSession = await fetch(`/api/sessions/${session.uuid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                boardId: boardId,
            }),
        }).then((i) => i.json());
        stepIndex = stepIndex + 1;
    };
</script>

<select bind:value={boardId} class="select select-accent mb-6">
    <option disabled selected value="">Select board to migrate</option>
    {#each $boards as board}
        <option value={board.id}>{board.name}</option>
    {/each}
</select>

<button on:click={() => setBoard()} class="btn btn-accent">Next</button>
