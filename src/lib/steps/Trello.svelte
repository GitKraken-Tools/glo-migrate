<script>
    import { onMount } from "svelte";
    import {
        boards,
        mapData,
        cards,
        user,
        fetchUser,
        fetchCards,
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
        data.columns
            .flatMap((i) => i.cards.flatMap((j) => j.created_by))
            .forEach((i) => {
                users[i.id] = i.username;
            });
        console.log(users);
    });
</script>

<table class="table">
    <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Linked</th>
    </tr>
    {#each Object.keys(users) as user}
        <tr>
            <td>{user}</td>
            <td>{users[user]}</td>
            <td>No</td>
        </tr>
    {/each}
</table>
