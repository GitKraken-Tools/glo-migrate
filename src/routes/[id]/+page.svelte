<script>
    import { page } from '$app/stores';
    import { TokenType } from '$lib/types';
    let loading = false;
    // console.log($page);
    // console.log($sessionStore);

    const migrate = async () => {
        loading = true;
        await fetch(`/api/trello/migrate?sessionId=${$page.data.session.id}`, {method: 'POST'});
        // alert(`${$page.data.session.gitkrakenBoardName} has been copied to Trello successfully!`);
        // window.location.href = '/';
        loading = false;
    }

    $: allAuthenticated = $page.data.activeProfiles[$page.data.session.id] === $page.data.session.gitkrakenBoardMemberIds.length;
</script>

<div class="flex">
    <div class="flex-1">
        <h1 class="font-bold">{$page.data.session.gitkrakenBoardName} <i class="fas fa-arrow-right"/> Trello</h1>
    </div>
    <div>
        <p class="font-thin"><i class="fas fa-users"/> {$page.data.activeProfiles[$page.data.session.id]}/{$page.data.session.gitkrakenBoardMemberIds.length}</p>
    </div>
</div>

{#if !loading}
    <table class="w-full mt-6 text-left">
        <tr>
            <th class="p-2">Username</th>
            <th class="p-2">Gitkraken ID</th>
            <th class="text-center p-2">GitKraken</th>
            <th class="text-center p-2">Trello</th>
        </tr>
        {#each $page.data.detailsMap as user}
            <tr class="font-thin">
                <td class="p-3">{user.gitkrakenUsername || ''}</td>
                <td class="p-3 text-xs">{user.gitkrakenId || ''}</td>
                {#each user.tokens as token}
                    <td>
                        {#if token.active}
                            <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center mx-auto">
                                <i class="fas fa-check"/>
                            </div>
                        {:else}
                            <div class="w-6 h-6 rounded-full border border-primary flex items-center justify-center mx-auto" />
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </table>

    {#if !$page.data.tokens.find(i => i.type === TokenType.TRELLO)}
        <a href="/api/trello/oauth?uuid={$page.data.session.id}&gitkrakenId={$page.data.profile.gitkrakenId}">
            <button class="bg-trello hover:bg-trello/50 rounded-md w-full p-3 mt-6">
                <i class="fab fa-trello mr-3"/> Connect My Trello
            </button>
        </a>
    {:else if $page.data.session.createdBy === $page.data.profile.gitkrakenId}
        <div class="flex gap-6 mt-6">

            {#if !allAuthenticated}
                <button on:click={() => migrate()} class="bg-red-500 hover:opacity-80 text-white p-3 rounded-md w-full">
                    <i class="fas fa-user" />
                    Migrate Solo
                </button>
            {/if}
            
            <button on:click={() => migrate()} class="bg-primary {allAuthenticated ? 'hover:opacity-80' : 'opacity-20'} text-white p-3 rounded-md w-full" disabled={!allAuthenticated}>
                <i class="fas fa-users" />
                Migrate
            </button>
        </div>

        {#if !allAuthenticated}
            <div class="font-thin text-sm mt-6 border rounded-md p-3">
                <h1 class="text-2xl font-bold mb-3">
                    <i class="fas fa-triangle-exclamation text-yellow-500"/> <span>Missing Members</span>
                </h1>
                <p class="text-sm">All parties must have their GitKraken and <span class="text-primary">Trello</span> accounts connected in order for the tool to properly associate the proper creator.</p>
                <p class="text-sm mt-3">You can continue solo, but all migrated content will show <span class="text-primary">{$page.data.profile.gitkrakenUsername}</span> as the creator of that content.</p>
            </div>
        {/if}
    {:else}
        <p class="mt-6">Waiting on session creator to start the migration</p>
    {/if}
{:else}
    <div class="text-center mt-6">
        <i class="fas fa-gear fa-spin text-6xl" />
        <p class="mt-3">Copying GitKraken Glo Board</p>
    </div>
{/if}