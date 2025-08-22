<script>
    export let data;

    const { user, guilds } = data;
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        {#if user && user.username}
            <p>Welcome, {user?.username}.</p>
            <a
                href="/auth/discord/logout"
                class="bg-black/5 p-[15px] rounded-xl w-fit">Logout</a
            >
        {:else}
            <p>You're not logged in!</p>
            <a
                href="/auth/discord/login"
                class="bg-black/5 p-[15px] rounded-xl w-fit">Login</a
            >
        {/if}
    </div>
    {#if guilds}
        <ul>
            {#each guilds as guild}
                <li>
                    <p>{guild.id}, {guild.name}</p>
                </li>
            {/each}
        </ul>
    {/if}
</div>
