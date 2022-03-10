<script>
    import { goto } from "$app/navigation";
    import { options } from '$lib/options';

    const create = async (target) => {
        const session = await fetch('/api/sessions', {method: 'POST', body: JSON.stringify({
            target
        })}).then(i => i.json());

        goto(`/${session.uuid}`)
        console.log(session);
    } 
</script>

<h1 class="card-title">Welcome to the Glo Migrator</h1>
<p class="font-light">
    This tool will migrate your Glo board to a different platform.
</p>
<p class="font-light">
    When you are ready, select the target platform you would like to migrate to.
</p>
<p class="mt-3">
    <b class="font-bold">Note: The session will be wiped every 30 minutes</b>.
</p>
<div class="mt-6 flex gap-6">
    {#each options as option}
        <button
            on:click={() => create(option.label)}
            class="btn text-white bg-accent flex-1
            {option.enabled ? '' : 'btn-disabled opacity-20'}"
        >
            <i class="{option.icon} mr-3" />
            {option.label}
        </button>
    {/each}
</div>
