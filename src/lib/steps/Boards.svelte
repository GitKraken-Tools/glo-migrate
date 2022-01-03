<script>
    import { onMount } from "svelte";
    import { fetchBoards, boards } from "$lib/stores";
    export let stepIndex;
    export let gloPat;
    export let boardId;

    onMount(async () => {
        fetchBoards(gloPat);
    });
</script>

<select bind:value={boardId} class="select select-accent mb-6">
    <option disabled="disabled" selected="selected"
        >Select board to migrate</option
    >
    {#each $boards as board}
        <option value={board.id}>{board.name}</option>
    {/each}
</select>

<button on:click={() => (stepIndex = stepIndex + 1)} class="btn btn-accent"
    >Next</button
>
