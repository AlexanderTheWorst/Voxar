<script module>
    import ExtensionIcon from "$lib/components/svgs/extension_icon.svelte";

    export const data = {
        widget: {
            icon: ExtensionIcon,
            name: "Modules",
        },
    };
</script>

<script>
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import { writable } from "svelte/store";
    import PersonAlertIcon from "$lib/components/svgs/person_alert_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import ArrowDownFilledIcon from "$lib/components/svgs/arrow_down_filled_icon.svelte";
    import { getContext, onMount } from "svelte";
    import GuildSidebar from "$lib/components/core/GuildSidebar.svelte";
    import ModuleContainer from "$lib/components/modules/ModuleContainer.svelte";
    import ExtensionOffIcon from "$lib/components/svgs/extension_off_icon.svelte";

    let { data, modules, out, loadedPages } = getContext("globals");

    export let widget = false;

    const { guild } = $data;

    let enabledModules = writable([]);

    $: $modules.forEach(mod => {
        let { enabled } = mod;
        let data = null;
        $enabledModules.push({ name: mod.name, enabled: null });
        mod.enabled.subscribe((data) => {
           $enabledModules = $enabledModules.map(m => ({
            ...m,
            enabled: m.name === mod.name ? data : m.enabled
           }))
        });
    });
</script>

{#if widget}
    <!-- Modules -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-primary-accent/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <ExtensionIcon size={32} color={"#7289DA"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">{$modules.length}</p>
            <p class="text-white/50 text-[18px]/[22px]">Modules</p>
        </div>
    </div>

    <!-- Active -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-[#72DA9D]/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <ExtensionIcon size={32} color={"#72DA9D"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">{$enabledModules.filter(m => m.enabled).length}</p>
            <p class="text-white/50 text-[18px]/[22px]">Enabled</p>
        </div>
    </div>

    <!-- Inactive -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-[#DA7272]/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <ExtensionOffIcon size={32} color={"#DA7272"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">{$enabledModules.filter(m => !m.enabled).length}</p>
            <p class="text-white/50 text-[18px]/[22px]">Disabled</p>
        </div>
    </div>
{:else}
    <div class="h-fit min-h-full w-full relative flex flex-col gap-[24px]">
        {#each $modules as module}
            <ModuleContainer {module} {data} />
        {/each}
    </div>
{/if}
