<script>
    import { writable } from "svelte/store";
    import Option from "./Option.svelte";

    export let data = writable(null);
    export let module;
    export let focusedOption = writable(null);

    let { enabled, expanded } = module;

    let { guild } = $data;
</script>

<div
    class="h-fit flex flex-col gap-[12px] duration-75 transition-all"
    class:max-h-0={!$expanded}
    class:max-h-auto={$expanded}
    class:overflow-hidden={!$expanded}
>
    {#each module.settings as setting}
        <div
            class="flex flex-col w-full p-[24px] bg-[#2D2D2D] rounded-[8px] transition-opacity duration-75"
            class:opacity-50={!$enabled || !setting.enabled}
        >
            <!-- Details -->
            <div
                class="flex justify-between items-center"
                style="margin-bottom: {setting.options.length ? '24px' : ''};"
            >
                <div class="flex flex-col gap-[5px] relative">
                    <p class="font-medium text-[20px]/[24px] h-full relative z-0">
                        {setting.name}
                    </p>
                    <p class="text-white/50 text-[18px]/[22px]">
                        {@html setting.description}
                    </p>
                </div>
                <div class="flex justify-end h-fit items-center gap-[12px]">
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
                    <Option {option} {module} {setting} />
                {/each}
            </div>
        </div>
    {/each}
</div>