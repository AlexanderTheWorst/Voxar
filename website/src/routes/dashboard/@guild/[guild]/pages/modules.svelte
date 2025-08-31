<script module>
    import PuzzleIcon from "$lib/components/svgs/puzzle_icon.svelte";

    export const data = {
        widget: {
            icon: PuzzleIcon,
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

    export let data = writable(null);
    export let widget = false;

    const { guild } = $data;

    let modules = [
        {
            name: "Verification",
            description:
                "Control how the verification process goes and what should happen when completed.",
            enabled: true,
            expanded: false,
            settings: [
                {
                    name: "Rename users",
                    description:
                        "Change the user's discord name to their roblox name.",
                    enabled: true,
                    options: [
                        {
                            name: "Format",
                            description:
                                "{GROUP_ROLE}: The name of their role, {USERNAME}: The name of their account",
                            type: "text",
                        },
                    ],
                },
                {
                    name: "Give user role",
                    description: "Give the user a verified role",
                    enabled: true,
                    options: [
                        {
                            name: "Role",
                            description:
                                "The role given to the user when verified.",
                            type: "role",
                        },
                    ],
                },
            ],
        },
    ];
</script>

{#if widget}
    <!-- Modules -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-primary-accent/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <PuzzleIcon size={32} color={"#7289DA"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">
                {modules.length}
            </p>
            <p class="text-white/50 text-[18px]/[22px]">Modules</p>
        </div>
    </div>
{:else}
    <div class="h-fit min-h-full w-full relative flex flex-col gap-[24px]">
        {#each modules as module}
            <div
                class="flex flex-col w-full p-[24px] border-[#373737] border-2 rounded-[8px]"
            >
                <!-- Details -->
                <div
                    class="flex justify-between items-center"
                    style="margin-bottom: {module.expanded ? '24px' : '0'};"
                >
                    <div class="flex flex-col gap-[5px]">
                        <p class="font-medium text-[20px]/[24px] h-full">
                            {module.name}
                        </p>
                        <p class="text-white/50 text-[18px]/[22px]">
                            {module.description}
                        </p>
                    </div>
                    <div
                        class="flex justify-end relative items-center gap-[12px]"
                    >
                        <!-- Toggle -->
                        <button
                            on:click={() => {
                                module = {
                                    ...module,
                                    enabled: !module.enabled,
                                };
                            }}
                            aria-label="module"
                            class="transition-color duration-75 w-[60px] h-[30px] rounded-full p-[4px] cursor-pointer"
                            style="background: {module.enabled
                                ? 'color-mix(in srgb, var(--color-primary-accent), transparent 75%)'
                                : '#2D2D2D'};"
                        >
                            <div
                                class="transition-all duration-75 aspect-square h-full bg-[#4B4B4B] rounded-full"
                                style="transform: {module.enabled
                                    ? 'translate(calc(100% + 8px));'
                                    : ''}"
                                class:bg-primary-accent={module.enabled}
                            ></div>
                        </button>
                        <button
                            class="cursor-pointer"
                            on:click={() => {
                                module = {
                                    ...module,
                                    expanded: !module.expanded,
                                };
                            }}
                        >
                            <ArrowDownFilledIcon size={38} />
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div
                    class="h-fit overflow-hidden flex flex-col gap-[12px] duration-75 transition-all"
                    class:max-h-0={!module.expanded}
                    class:max-h-auto={module.expanded}
                >
                    {#each module.settings as setting}
                        <div
                            class="flex flex-col w-full p-[24px] bg-[#2D2D2D] rounded-[8px] transition-opacity duration-75"
                            class:opacity-50={!module.enabled ||
                                !setting.enabled}
                        >
                            <!-- Details -->
                            <div
                                class="flex justify-between items-center"
                                style="margin-bottom: {setting.options.length
                                    ? '24px'
                                    : ''};"
                            >
                                <div class="flex flex-col gap-[5px]">
                                    <p
                                        class="font-medium text-[20px]/[24px] h-full"
                                    >
                                        {setting.name}
                                    </p>
                                    <p class="text-white/50 text-[18px]/[22px]">
                                        {setting.description}
                                    </p>
                                </div>
                                <div
                                    class="flex justify-end h-fit items-center gap-[12px]"
                                >
                                    <!-- Toggle -->
                                    <button
                                        on:click={() => {
                                            setting = {
                                                ...setting,
                                                enabled: !setting.enabled,
                                            };
                                        }}
                                        aria-label="module"
                                        class="transition-color duration-75 w-[60px] h-[30px] rounded-full p-[4px] cursor-pointer"
                                        style="background: {setting.enabled
                                            ? 'color-mix(in srgb, var(--color-primary-accent), transparent 75%)'
                                            : '#232323'};"
                                    >
                                        <div
                                            class="transition-all duration-75 aspect-square h-full bg-[#4B4B4B] rounded-full"
                                            style="transform: {setting.enabled
                                                ? 'translate(calc(100% + 8px));'
                                                : ''}"
                                            class:bg-primary-accent={setting.enabled}
                                        ></div>
                                    </button>
                                </div>
                            </div>
                            <!-- Options -->
                            <div class="flex flex-col gap-[24px]">
                                {#each setting.options as option}
                                    <div
                                        class="w-full relative flex flex-col gap-[14px]"
                                    >
                                        <div class="flex flex-col gap-[5px]">
                                            <p
                                                class="font-medium text-[18px]/[22px] h-full"
                                            >
                                                {option.name}
                                            </p>
                                            <p
                                                class="text-white/50 text-[16px]/[20px]"
                                            >
                                                {option.description}
                                            </p>
                                        </div>

                                        <div
                                            class="p-[18px] w-full flex gap-[12px] items-center relative bg-[#232323] rounded-[8px]"
                                        >
                                            {#if option.type == "text"}
                                                <input
                                                    class="outline-0 flex-1"
                                                    type="text"
                                                    placeholder={option.name}
                                                />
                                            {:else if option.type == "role"}
                                                <p class="font-bold">@</p>
                                                <input
                                                    class="outline-0 flex-1"
                                                    type="text"
                                                    placeholder={option.name}
                                                />
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{/if}
