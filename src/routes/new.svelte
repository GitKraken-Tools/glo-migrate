<h1 class="font-bold text-2xl mb-6">Start a new migration</h1>

<div class="flex gap-6 mb-6">
    <div class="flex-1">
        <p>GitKraken Glo Board</p>
        <select type="text" placeholder="" class="bg-white/10 border rounded-md p-3 w-full">
            <option>GitKraken Ambassador Resources</option>
        </select>
    </div>
    
    <div class="flex-1">
        <p>Target</p>
        <select type="text" placeholder="" class="bg-white/10 border rounded-md p-3 w-full">
            <option>Trello</option>
        </select>
    </div>
</div>

<p>New <span class="text-primary">Trello</span> Board Name</p>
<input type="text" placeholder="GitKraken Ambassador Resources" class="bg-white/10 border rounded-md p-3 w-full">

<a href="/api/gitkraken/oauth">
    <button class="bg-primary hover:opacity-80 text-white p-3 rounded-md w-full mt-6">
        <i class="fas fa-bolt" />
        Create Migration Session
    </button>
</a>