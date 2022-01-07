<script>
    import { boards, cards } from "$lib/stores";

    export let boardId;
    export let session;

    const launch = async () => {
        console.log("session", session);
        await fetch("/api/process/trello", {
            method: "POST",
            body: JSON.stringify({
                board: $boards.find((i) => i.id === boardId),
                session,
            }),
        });
    };
</script>

<button on:click={() => launch()} class="btn btn-accent"
    >Migrate to {session.target}</button
>
