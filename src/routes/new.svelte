<script>
    export let boards = [];

    let newSession = {
        gitkrakenBoardId: boards[0].id,
        target: 'Trello'
    }

    const create = async () => {
        newSession.gitkrakenBoardName = boards.find(i => i.id === newSession.gitkrakenBoardId).name;
        const session = await fetch('/api/sessions', {method: 'POST', body: JSON.stringify(newSession)}).then(i => i.json());
        window.location.href = `/${session.uuid}`;
        console.log(session);
    }
</script>

<h1 class="font-bold text-2xl mb-6">Start a new migration</h1>

<div class="flex gap-6">
    <div class="flex-1">
        <p>GitKraken Glo Board</p>
        <select bind:value={newSession.gitkrakenBoardId} type="text" class="bg-white/10 border rounded-md p-3 w-full">
            {#each boards as board}
                <option value={board.id}>{board.name}</option>
            {/each}
        </select>
    </div>
    
    <div class="flex-1">
        <p>Target</p>
        <select bind:value={newSession.target} type="text" class="bg-white/10 border rounded-md p-3 w-full">
            <option>Trello</option>
        </select>
    </div>
</div>

<button on:click={() => create()} class="bg-primary hover:opacity-80 text-white p-3 rounded-md w-full mt-6">
    <i class="fas fa-bolt" />
    Create Migration Session
</button>