<script lang="ts">
    import type { Session } from "$lib/types";
    import {page} from '$app/stores';

    export let session: Session | null = null;
</script>

<div class="rounded-md border border-primary p-3 flex items-center mt-3 cursor-pointer hover:bg-primary/10">
    <div class="flex-1">
        {#if session}
            <p class="font-thin">{session.gitkrakenBoardName} <i class="fas fa-arrow-right"/> Trello</p>
        {:else}
            <p class="font-thin">Start a new migration</p>
        {/if}
    </div>
    {#if session && session.id}
        <div>
            <p class="font-thin"><i class="fas fa-users"/> {$page.data.activeProfiles[session.id]}/{session.gitkrakenBoardMemberIds.length}</p>
        </div>
    {/if}
</div>