<script>
    import { onMount } from "svelte";
    import GloSDK from "@axosoft/glo-sdk";
    export let stepIndex;
    export let gloPat;

    let boards = [];
    onMount(async () => {
        boards = await GloSDK(gloPat).boards.getAll({
            fields: ["name", "labels", "columns", "archived_columns"],
        });
        const cards = await GloSDK(gloPat).boards.cards.getAll(
            "6059ef1d2ad1e3001124146f",
            {
                fields: [
                    "archived_date",
                    "assignees",
                    "attachment_count",
                    "column_id",
                    "comment_count",
                    "created_by",
                    "created_date",
                    "due_date",
                    "description",
                    "labels",
                    "name",
                    "total_task_count",
                    "milestone",
                    "is_divider",
                ],
            }
        );
        const user = await GloSDK(gloPat).users.getCurrentUser();
        console.log("boards", boards);
        console.log("cards", cards);
        console.log("user", user);
    });
</script>

<select class="select select-accent mb-6">
    <option disabled="disabled" selected="selected"
        >Select board to migrate</option
    >
    {#each boards as board}
        <option>{board.name}</option>
    {/each}
</select>

<button on:click={() => (stepIndex = stepIndex + 1)} class="btn btn-accent"
    >Next</button
>
