<script lang="ts">
    import type { Session } from "$lib/types";

    export let session: Session;

    const getAuthenticatedUserCount = () => {
        // return session.gitkrakenBoardMemberIds.filter(i => {
        //     const found = i.tokens?.find(j => j.type === 'Trello');
        //     return !!found;
        // }).length;
        return 0;
    }

    // console.log('the session', session);
</script>

<div class="rounded-md border border-primary p-3 flex items-center mt-3 cursor-pointer hover:bg-primary/10">
    <!-- <div class="mr-3">
        <div class="w-6 h-6 rounded-full {selected ? 'border-accent border-4 bg-primary ring ring-primary' : 'border-primary border'}" />
    </div> -->
    <div class="flex-1">
        {#if session}
            <p class="font-thin">{session.gitkrakenBoardName} <i class="fas fa-arrow-right"/> Trello</p>
        {:else}
            <p class="font-thin">Start a new migration</p>
        {/if}
    </div>
    {#if session}
        <div>
            <p class="font-thin"><i class="fas fa-users"/> {getAuthenticatedUserCount()}/{session.gitkrakenBoardMemberIds.length}</p>
        </div>
    {/if}
</div>