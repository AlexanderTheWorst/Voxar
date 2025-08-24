<script>
    export let data;

    const { user, guilds, mutuals } = data;
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        {#if user && user.username}
            <p>Welcome, {user?.username}.</p>
            <a
                href="/auth/discord/logout"
                class="bg-black/5 p-[15px] rounded-xl w-fit">Logout</a
            >
        {/if}
    </div>
    {#if guilds}
        <ul class="flex flex-col gap-[10px]">
            {#each guilds as guild}
                <li class="items-center flex flex-row gap-[10px]">
                    <p>{guild.id}, {guild.name}</p>
                    <a
                        href="{mutuals.find((g) => g.id === guild.id)
                            ? `/dashboard/@guild/${guild.id}`
                            : `/auth/discord/@bot/add/${guild.id}`}"
                        class="bg-black/5 p-[15px] rounded-xl w-fit"
                    >
                        {mutuals.find((g) => g.id === guild.id)
                            ? "Manage"
                            : "Add"}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</div>