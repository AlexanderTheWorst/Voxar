<script>
    import GuildSidebar from "$lib/components/core/GuildSidebar.svelte";
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let data = writable(null);
    data = writable(data);

    const { guild } = $data;

    let out = writable("overview");
    let currentPage = writable(null);

    const pages = import.meta.glob("./pages/*.svelte");
    let loadedPages = [];

    $: $currentPage =
        (loadedPages.find((p) => p.name === ($out ?? "")) ?? {}).component ??
        null;

    onMount(async () => {
        const imports = Object.entries(pages).map(async ([path, loader]) => {
            const module = await loader();
            return {
                name: path
                    .replace("./pages/", "")
                    .replace(".svelte", "")
                    .toLowerCase(),
                component: module.default,
                data: module.data
            };
        });

        loadedPages = await Promise.all(imports);
    });
</script>

<main class="flex flex-row">
    <GuildSidebar {data} {out} />

    <div class="flex-1 relative h-screen p-[96px] overflow-y-scroll">
        {#if $currentPage}
            <svelte:component this={$currentPage} {loadedPages} {data} {out} />
        {:else}
            <div
                class="w-full h-full relative flex items-center justify-center"
            >
                <Loader />
            </div>
        {/if}
    </div>
</main>
