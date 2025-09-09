<script>
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import PersonAlertIcon from "$lib/components/svgs/person_alert_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import ArrowDownFilledIcon from "$lib/components/svgs/arrow_down_filled_icon.svelte";
    import { writable } from "svelte/store";
    import SettingContainer from "./SettingContainer.svelte";

    export let data = writable(null);
    export let module = {
        name: "Module",
        description: "The description",
        expanded: true,
        enabled: true,

        settings: [
            {
                name: "Setting",
                description: "The description",
                enabled: true,

                options: [
                    {
                        name: "Option",
                        description: "The description",
                        type: "role",
                        suggestions: ["hey", "bye", "yo"],
                        filtered: ["hey", "bye", "yo"],
                        inputRef: null,
                    },
                ],
            },
        ],
    };

    let { guild } = $data;

    let { enabled, expanded } = module;

    // console.log(module);
</script>

<div
    class="flex flex-col w-full p-[24px] border-[#373737] bg-primary-bg border-2 rounded-[8px]"
>
    <!-- Details -->
    <div
        class="flex justify-between items-center"
        style="margin-bottom: {$expanded ? '24px' : '0'};"
    >
        <div class="flex flex-col gap-[5px]">
            <p class="font-medium text-[20px]/[24px] h-full">
                {module.name}
            </p>
            <p class="text-white/50 text-[18px]/[22px]">
                {module.description}
            </p>
        </div>
        <div class="flex justify-end relative items-center gap-[12px]">
            <!-- Toggle -->
            <button
                on:click={() => {
                    $enabled = !$enabled;
                    console.log($enabled);
                }}
                aria-label="module"
                class="transition-color duration-75 w-[60px] h-[30px] rounded-full p-[4px] cursor-pointer"
                style="background: {$enabled
                    ? 'color-mix(in srgb, var(--color-primary-accent), transparent 75%)'
                    : '#2D2D2D'};"
            >
                <div
                    class="transition-all duration-75 aspect-square h-full bg-[#4B4B4B] rounded-full"
                    style="transform: {$enabled
                        ? 'translate(calc(100% + 8px));'
                        : ''}"
                    class:bg-primary-accent={$enabled}
                ></div>
            </button>
            <button
                class="cursor-pointer"
                on:click={() => ($expanded = !$expanded)}
            >
                <ArrowDownFilledIcon size={38} />
            </button>
        </div>
    </div>

    <!-- Content -->
    <SettingContainer {module} {data} />
</div>
