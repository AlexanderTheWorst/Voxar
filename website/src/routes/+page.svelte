<script>
    export let data;
    
    const { user, guilds } = data;
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        <p>Welcome, {user.username}.</p>
        <a href="/oauth2/logout?platform=discord" class="bg-black/5 p-[15px] rounded-xl w-fit">Logout</a>
    </div>
    <ul>
        {#each guilds as guild}
            <li>
                <p>{guild.id}, {guild.name}</p>
            </li>
        {/each}
    </ul>
</div>