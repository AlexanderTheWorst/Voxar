<script>
    import GuildSidebar from "$lib/components/core/GuildSidebar.svelte";
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    
    export let data = writable(null);
    data = writable(data);

    let { guild, modules: unloadedModules = undefined } = $data;
    
    let modules = writable([]);

    // let modules = writable([]); // writable(ModuleManager.all.map(m => ({
    //     ...m,
    //     enabled: writable(true),
    //     expanded: writable(false),

    //     settings: m.settings.map(s => ({
    //         ...s,
    //         enabled: true,

    //         options: s.options.map(o => ({
    //             ...o,
    //             suggestions: o.type == "role" ? guild.roles : o.type == "channel" ? guild.channels : null
    //         }))
    //     }))
    // })));

    let out = writable("overview");
    let currentPage = writable(null);

    const pages = import.meta.glob("./pages/*.svelte");
    let loadedPages = writable([]);

    $: $currentPage =
        ($loadedPages.find((p) => p.name === ($out ?? "")) ?? {}).component ??
        null;

    setContext("globals", {
        data,
        modules,
        loadedPages,
        out,
    });

    onMount(async () => {
        let loadedModules = await unloadedModules;
        $modules = loadedModules.map(mod => ({
            ...mod,
            enabled: writable(mod.enabled),
            expanded: writable(false)
        }));
        console.log($modules);

        const imports = Object.entries(pages).map(async ([path, loader]) => {
            const module = await loader();
            return {
                name: path
                    .replace("./pages/", "")
                    .replace(".svelte", "")
                    .toLowerCase(),
                component: module.default,
                data: module.data,
            };
        });

        $loadedPages = await Promise.all(imports);
    });
</script>

<main class="flex flex-row">
    <GuildSidebar {data} {out} />

    <div class="flex-1 relative h-screen p-[96px] overflow-y-scroll">
        {#if $currentPage}
            <svelte:component
                this={$currentPage}
            />
        {:else}
            <div
                class="w-full h-full relative flex items-center justify-center"
            >
                <Loader />
            </div>
        {/if}
    </div>
</main>
