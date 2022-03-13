<script>
    export let selected = false;
    export let session;
</script>

<div on:click={() => selected = true} class="rounded-md border border-primary p-3 flex items-center mt-3 {selected ? '' : 'cursor-pointer hover:bg-primary/5'}">
    <div class="mr-3">
        <div class="w-6 h-6 rounded-full {selected ? 'border-accent border-4 bg-primary ring ring-primary' : 'border-primary border'}" />
    </div>
    <div class="flex-1">
        {#if session}
            <p class="font-thin">GitKraken Ambassador Resources <i class="fas fa-arrow-right"/> Trello</p>
        {:else}
            <p class="font-thin">Start a new migration</p>
        {/if}
    </div>
    {#if session}
        <div>
            <p class="font-thin"><i class="fas fa-users"/> 1/3</p>
        </div>
    {/if}
</div>