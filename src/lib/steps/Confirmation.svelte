<script>
    export let session;

    const launch = () => {
        console.log("launch");
    };
</script>

<button on:click={() => launch()} class="btn btn-accent"
    >Migrate to {session.target}</button
>
