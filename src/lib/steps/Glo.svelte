<script>
    export let stepIndex;
    export let gloPat;
</script>

<p><b class="font-bold">GitKraken Boards PAT</b></p>
<input type="text" class="input my-6" bind:value={gloPat} />
<button on:click={() => (stepIndex = stepIndex + 1)} class="btn btn-accent"
    >Next</button
>
