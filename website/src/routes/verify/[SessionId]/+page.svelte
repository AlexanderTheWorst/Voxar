<script>
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let data;
    data = writable(data);

    let { guild, user, user_data } = $data;

    console.log(guild);
</script>

<div class="w-screen h-screen flex items-center justify-center">
    <div class="h-fit w-fit max-w-[calc(100vw_-_100px)] max-h-[calc(100vh_-_100px)] pt-[86px]">
        <!-- Icon container -->
        <div
            class="relative bg-primary-bg border-[#373737] border-2 w-fit h-fit rounded-[25px] flex flex-col pt-[90px]"
        >
            <!-- Icon border -->
            <div class="w-full h-full top-0 absolute overflow-hidden">
                <div
                    class="rounded-full aspect-square w-[180px] absolute top-[-90px] justify-self-center bg-[#373737]"
                ></div>
            </div>

            <!-- Server logo -->
            <div
                class="absolute select-none w-[176px] top-[-88px] self-center bg-primary-bg border-primary-bg border-[8px] aspect-square rounded-full overflow-hidden"
            >
                {#if guild.icon}
                    <img
                        class="w-full h-full"
                        src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png?size=128"
                        alt={guild.name}
                        draggable="false"
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
                                .map((t) => t.substr(0, 1).toUpperCase())
                                .join("")}
                        </p>
                    </div>
                {/if}
            </div>

            <div class="p-[30px] pt-[15px] w-fit h-fit z-10">
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
                <p>Hello, this is a random message without any meaning.</p>
             </div>
        </div>
    </div>
</div>
