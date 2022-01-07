<script>
    import { goto } from "$app/navigation";

    let options = [
        {
            label: "Trello",
            icon: "fab fa-trello",
            enabled: true,
        },
        {
            label: "Jira",
            icon: "fab fa-jira",
            enabled: false,
        },
        {
            label: "Github",
            icon: "fab fa-github",
            enabled: false,
        },
        {
            label: "GitLab",
            icon: "fab fa-gitlab",
            enabled: false,
        },
    ];

    const init = async (target) => {
        const res = await fetch(`/api/init?target=${target}`, {
            method: "POST",
        }).then((i) => i.json());
        goto(`/${res.uuid}`);
    };
</script>

<pre>{JSON.stringify(import.meta.env, null, 3)}</pre>

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
            on:click={() => init(option.label)}
            class="btn text-white bg-accent flex-1
            {option.enabled ? '' : 'btn-disabled opacity-20'}"
        >
            <i class="{option.icon} mr-3" />
            {option.label}
        </button>
    {/each}
</div>
