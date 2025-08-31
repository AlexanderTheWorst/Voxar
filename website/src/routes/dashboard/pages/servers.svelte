<script>
    import { preloadData } from "$app/navigation";
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let data = writable(null);

    let { user, user_data } = $data;
    let guilds = writable(null);

    function addBot(guild) {
        if (guild.botInServer) return;

        let width = 600;
        let height = 800;

        const screenLeft =
            window.screenLeft !== undefined
                ? window.screenLeft
                : window.screenX;
        const screenTop =
            window.screenTop !== undefined ? window.screenTop : window.screenY;

        // Get window inner dimensions
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        // Calculate top and left to center the popup
        const left = screenLeft + (innerWidth - width) / 2;
        const top = screenTop + (innerHeight - height) / 2;

        const url = `/auth/discord/@bot/add/${guild.id}`;

        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no`;

        window.open(url, "_blank", features);
    }

    onMount(async () => {
        $guilds = await $data.guilds;

        let listener = window.addEventListener("message", async (event) => {
            if (event.origin !== window.location.origin) return; // security check
            if (event.data.type === "callback") {
                let data = event.data.data;

                const { error, error_description, guild_id } = data;

                if (
                    !error &&
                    guild_id &&
                    $guilds.find((g) => g.id === guild_id)
                ) {
                    // Assume it was a success.
                    $guilds = $guilds.map((g) => ({
                        ...g,
                        botInServer: g.id === guild_id || g.botInServer,
                    }));
                    await preloadData(`/dashboard/@guild/${guild_id}`);
                }
            }
        });

        return () => {
            removeEventListener("message", listener);
        };
    });
</script>

{#if !$guilds}
    <div class="flex items-center justify-center h-full w-full relative">
        <Loader />
    </div>
{:else}
    <div
        class="flex flex-row items-top justify-center flex-wrap gap-[20px]"
        id="guilds_list"
    >
        {#each $guilds as guild}
            <div
                style="background: {guild.botInServer
                    ? 'color-mix(in srgb, var(--color-primary-accent), rgba(255 255 255 / 0%) 87%)'
                    : 'rgba(255 255 255 / 5%)'};"
                class="
                border-[2px] aspect-square rounded-[16px] p-[20px] overflow-hidden flex items-center justify-center
                hover:translate-y-[-5px] transition-[translate] duration-300 hover:cursor-pointer
                {guild.botInServer ? 'border-primary-accent/50' : ''}
                "
                class:saturate-0={!guild.botInServer}
                class:border-inactive-accent={!guild.botInServer}
            >
                <a
                    class="w-full h-full relative"
                    on:click={() => addBot(guild)}
                    href={guild.botInServer
                        ? `/dashboard/@guild/${guild.id}`
                        : `#`}
                >
                    <!-- `/auth/discord/@bot/add/${guild.id}`} -->
                    <div class="w-full aspect-square">
                        {#if guild.icon}
                            <img
                                class="h-full w-full relative rounded-full"
                                src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png?size=128"
                                alt={guild.name}
                            />
                        {:else}
                            <div
                                class="
                                        w-full h-full grid rounded-full overflow-hidden
                                        place-items-center
                                        "
                            >
                                <!-- Both layers occupy the same grid cell -->
                                <div
                                    class="w-full h-full bg-[radial-gradient(circle_at_top_left,_#7289DABF,_#7289DA40)] opacity-[0.45] row-start-1 col-start-1"
                                ></div>

                                <p
                                    class="text-3xl font-medium row-start-1 col-start-1 place-self-center relative"
                                >
                                    {guild.name
                                        .split(" ")
                                        .map((t) =>
                                            t.substr(0, 1).toUpperCase(),
                                        )
                                        .join("")}
                                </p>
                            </div>
                        {/if}
                    </div>
                </a>
            </div>
        {/each}
    </div>
{/if}

<style>
    #guilds_list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
</style>
