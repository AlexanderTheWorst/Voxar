<script>
    export let data;

    const { user, guilds, mutuals, user_data } = data;
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        {#if user && user.username}
            <p>Welcome, {user?.username}.</p>
            <a
                href="/auth/discord/logout"
                class="bg-black/5 p-[15px] rounded-xl w-fit">Logout</a
            >

            <div class="flex gap-[10px] items-center">
                <p class="font-bold">Here are your linked roblox accounts</p>
                <a
                    href="/auth/roblox/link"
                    class="bg-black/5 p-[15px] rounded-xl w-fit">Link account</a
                >
            </div>
            <ul class="flex flex-col gap-[10px]">
                {#if user_data && user_data?.linkedAccounts.length == 0}
                    <p>No linked accounts.</p>
                {:else if user_data}
                    {#each user_data.linkedAccounts as robloxAccount}
                        <li class="items-center flex flex-row gap-[10px]">
                            <p>{robloxAccount.username}</p>
                            <a
                                href="/auth/roblox/unlink/{robloxAccount.id}"
                                class="bg-black/5 p-[15px] rounded-xl w-fit"
                            >
                                Unlink
                            </a>
                        </li>
                    {/each}
                {/if}
            </ul>
        {/if}
    </div>
    
    {#if guilds}
        <p class="font-bold">Here are your discord servers.</p>
        <ul class="flex flex-col gap-[10px]">
            {#each guilds as guild}
                <li class="items-center flex flex-row gap-[10px]">
                    <p>{guild.id}, {guild.name}</p>
                    <a
                        href={mutuals.find((g) => g.id === guild.id)
                            ? `/dashboard/@guild/${guild.id}`
                            : `/auth/discord/@bot/add/${guild.id}`}
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
