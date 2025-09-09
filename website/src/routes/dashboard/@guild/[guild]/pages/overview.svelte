<script module>
    export const data = {};
</script>

<script>
    import CheckmarkIcon from "$lib/components/svgs/checkmark_icon.svelte";
    import ExtensionIcon from "$lib/components/svgs/extension_icon.svelte";

    import { getContext, onMount } from "svelte";

    import { writable } from "svelte/store";
    import Commands from "./commands.svelte";
    import Members from "./members.svelte";
    import KeyboardIcon from "$lib/components/svgs/keyboard_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import HistoryIcon from "$lib/components/svgs/history_icon.svelte";
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";

    let { data, modules, out, loadedPages } = getContext("globals");
    console.log(loadedPages);

    $: widgets = $loadedPages
        .filter((p) => p.data.widget)
        .map((p) => ({ ...p.data.widget, component: p.component, page_name: p.name }));
</script>

<div class="w-full h-fit min-h-full flex flex-col gap-[24px]">
    <!-- Keys -->
    <div class="flex flex-col gap-[24px]">
        <!-- Label -->
        <div class="flex flex-row gap-[18px] items-center">
            <p class="text-[20px] font-medium">Keys</p>
            <div
                class="flex-1 h-[2px] bg-[color-mix(in_srgb,#373737,_transparent_25%)]"
            ></div>
        </div>

        <!-- Roblox API key -->
        <div class="flex flex-col gap-[8px] items-center">
            <!-- Name, status -->
            <div class="flex w-full">
                <p class="text-[18px]">ROBLOX API KEY</p>
                <div
                    class="flex-1 flex items-center justify-end gap-[5px] text-[#AEFA63]"
                >
                    <p>Validated</p>
                    <CheckmarkIcon size={30} color={"#AEFA63"} />
                </div>
            </div>
            <!-- Input -->
            <div
                class="w-full border-2 border-[#373737] p-[18px] overflow-hidden rounded-[8px] bg-primary-bg"
            >
                <p class="overflow-hidden w-full text-[22px]">
                    •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                </p>
            </div>
        </div>
    </div>

    <!-- Overview -->
    <div class="flex flex-col gap-[24px] h-fit w-full">
        <!-- Label -->
        <div class="flex flex-row gap-[18px] items-center">
            <p class="text-[20px] font-medium">Overview</p>
            <div
                class="flex-1 h-[2px] bg-[color-mix(in_srgb,#373737,_transparent_25%)]"
            ></div>
        </div>
        <div class="custom-grid h-fit w-full gap-[24px]">
            <!-- Widgets -->
            <div class="flex flex-col gap-[24px]">
                {#each widgets as widget}
                    <div
                        on:click={() => $out = widget.page_name}
                        role="button"
                        tabindex=0
                        on:keydown={() => {}}
                        class="pt-[12px] cursor-pointer h-fit relative z-10 "
                    >
                        <div
                            class="h-[fit] w-full relative border-2 border-[#373737] rounded-[8px] grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] p-[24px] gap-[24px] bg-primary-bg"
                        >
                            <svelte:component
                                this={widget.component}
                                widget
                            />
                        </div>
                        <div
                            class="absolute top-0 left-[18px] bg-[#232323] px-[10px] flex gap-[10px]"
                        >
                            <svelte:component this={widget.icon} size={24} />
                            <p class="text-[16px] bg-primary-bg">{widget.name}</p>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Logs -->
            <div class="h-[500px] bg-primary-bg">
                <div class="pt-[12px] h-[500px] relative z-10">
                    <div
                        class="h-full w-full relative border-2 border-[#373737] rounded-[8px]"
                    ></div>
                    <div
                        class="absolute top-0 left-[18px] bg-[#232323] px-[10px] flex gap-[10px]"
                    >
                        <HistoryIcon size={24} />
                        <p class="text-[16px]">Logs</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .custom-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
</style>
