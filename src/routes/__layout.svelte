<div class="flex items-center content-center h-screen w-screen">
    <div class="mx-auto w-[800px] -mt-36 p-6">
        <div>
            <img src="/gitkraken_glo.png" alt="logo" class="w-20 m-6 mx-auto" />
        </div>
        <div class="card card-bordered bg-neutral shadow-lg">
            <div class="card-body">
                <slot />
            </div>
        </div>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap");
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
