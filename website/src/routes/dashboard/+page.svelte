<script>
    import { preloadCode, preloadData } from "$app/navigation";
    import Sidebar from "$lib/components/core/Sidebar.svelte";
    import UserSidebar from "$lib/components/core/UserSidebar.svelte";
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";

    export let data;
    data = writable(data);
    const { user, user_data, guilds } = $data;

    let out = writable("servers");
    let currentPage = writable(null);

    const pages = import.meta.glob("./pages/*.svelte");
    let loadedPages = writable([]);

    $: $currentPage =
        ($loadedPages.find((p) => p.name === ($out ?? "")) ?? {}).component ??
        null;

    setContext("globals", { data, out, loadedPages });

    onMount(async () => {
        const imports = Object.entries(pages).map(async ([path, loader]) => {
            const module = await loader();
            return {
                name: path
                    .replace("./pages/", "")
                    .replace(".svelte", "")
                    .toLowerCase(),
                component: module.default,
            };
        });

        $loadedPages = await Promise.all(imports);
    });
</script>

<main class="flex flex-row min-h-screen">
    <UserSidebar />

    <div
        class="flex flex-col flex-1 gap-[10px] h-screen p-[96px] overflow-y-scroll"
    >
        <!-- <div class="loader"></div>  -->

        {#if $currentPage}
            <svelte:component this={$currentPage} } />
        {:else}
            <div
                class="h-full w-full relative flex items-center justify-center"
            >
                <Loader />
            </div>
        {/if}

        <!-- 
            
        -->
    </div>
</main>
