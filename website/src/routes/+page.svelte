<script>
    export let data;

    const { user } = data;
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        Welcome to Voxar!
        {#if user}
            <a href="/dashboard" class="bg-black/5 p-[15px] rounded-xl w-fit"
                >Dashboard</a
            >
        {:else}
            <a
                href="/auth/discord/login"
                class="bg-black/5 p-[15px] rounded-xl w-fit">Login</a
            >
        {/if}
    </div>
</div>
