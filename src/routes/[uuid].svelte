<script>
    import { session as sessionStore } from '$app/stores';
    export let session;
    let loading = false;
    console.log(session);

    const getAuthenticatedUserCount = () => {
        return session.gitkrakenBoardUsers.filter(i => {
            const found = i.tokens?.find(j => j.type === 'Trello');
            return !!found;
        }).length;
    }

    const migrate = async () => {
        loading = true;
        await fetch(`/api/${session.target.toLowerCase()}/migrate`, {method: 'POST', body: JSON.stringify(session)});
        alert(`${session.gitkrakenBoardName} has been copied to ${session.target} successfully!`);
        // window.location.href = '/';
    }

    $: allAuthenticated = getAuthenticatedUserCount() === session.gitkrakenBoardUsers.length;
</script>

<div class="flex">
    <div class="flex-1">
        <h1 class="font-bold">{session.gitkrakenBoardName} <i class="fas fa-arrow-right"/> {session.target}</h1>
    </div>
    <div>
        <p class="font-thin"><i class="fas fa-users"/> {getAuthenticatedUserCount()}/{session.gitkrakenBoardUsers.length}</p>
    </div>
</div>

{#if !loading}
    <table class="w-full mt-6 text-left">
        <tr>
            <th>Username</th>
            <th>Gitkraken ID</th>
            <th class="text-center py-2">{session.target}</th>
        </tr>
        {#each session.gitkrakenBoardUsers as user}
            <tr class="font-thin">
                <td>{user.gitkrakenUsername || ''}</td>
                <td>{user.gitkrakenId || ''}</td>
                <td>
                    {#if user.tokens?.find(i => i.type === session.target)}
                        <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center mx-auto">
                            <i class="fas fa-check"/>
                        </div>
                    {:else}
                        <div class="w-6 h-6 rounded-full border border-primary flex items-center justify-center mx-auto" />
                    {/if}
                </td>
            </tr>
        {/each}
    </table>

    {#if !$sessionStore.tokens.find(i => i.type === session.target)}
        <a href="/api/trello/oauth?uuid={session.uuid}&gitkrakenId={$sessionStore.gitkrakenId}">
            <button class="bg-trello hover:bg-trello/50 rounded-md w-full p-3 mt-6">
                <i class="fab fa-trello mr-3"/> Connect My Trello
            </button>
        </a>
    {:else if session.createdBy === $sessionStore.gitkrakenId}
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
                <p class="text-sm">All parties must have their GitKraken and <span class="text-primary">{session.target}</span> accounts connected in order for the tool to properly associate the proper creator.</p>
                <p class="text-sm mt-3">You can continue solo, but all migrated content will show <span class="text-primary">kyjus25</span> as the creator of that content.</p>
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









