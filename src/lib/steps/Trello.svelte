<script>
    import { onMount } from "svelte";
    import {
        boards,
        mapData,
        cards,
        user,
        fetchUser,
        fetchCards,
        onlyUnique,
    } from "$lib/stores";
    export let stepIndex;
    export let gloPat;
    export let boardId;

    let users = [];
    onMount(async () => {
        await fetchCards(gloPat, boardId);
        await fetchUser(gloPat);

        const board = $boards.find((i) => i.id === boardId);
        console.log("board I want", board, $boards, boardId);
        const data = mapData(board, $cards, [$user]);
        console.log("data", data);
        users = data.columns.flatMap((i) =>
            i.cards.flatMap((j) => j.created_by)
        );
        console.log(users);
    });
</script>

<table class="table">
    <tr>
        <th>Username</th>
        <th>ID</th>
        <th>Linked</th>
    </tr>
    <tr>
        <td>kyjus25</td>
        <td>ID</td>
        <td>No</td>
    </tr>
</table>
