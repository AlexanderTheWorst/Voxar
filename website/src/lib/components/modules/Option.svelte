<script>
    import { getContext, onMount } from "svelte";
    import { writable } from "svelte/store";

    let { data, out } = getContext("globals");

    export let option;
    export let module;
    export let setting;

    let { guild } = $data;

    let input = document.createElement("input");
    let focused = writable(false);
    let filtered = writable([]);
    let suggestions;

    switch (option.type) {
        case "role":
            suggestions = guild.roles;
            break;
        case "channel":
            suggestions = guild.channels;
            break;
    }

    let { enabled } = module;

    $: if (!$enabled || !setting.enabled) input.toggleAttribute("disabled");
    else input.removeAttribute("disabled");

    $: {
        let moduleKey = module.key;
        let settingKey = setting.key;
        let optionKey = option.key;

        console.log(moduleKey, settingKey, optionKey, option.value);
    }

    onMount(() => {
        $filtered = suggestions;

        if (option.type == "text") {
            input.value = option.value;
        }

        input.oninput = () => {
            switch (option.type) {
                case "role":
                case "channel":
                    let text = input.value;
                    console.log(option.type);
                    $filtered = suggestions.filter(
                        (s) =>
                            s.name.toLowerCase().substr(0, text.length) ==
                            text.toLowerCase(),
                    );
                    break;
                default:
                    break;
            }
        };

        input.onfocus = () => {
            $focused = true;
        };

        input.onblur = () => {
            $focused = false;
        };

        return () => {
            input.onfocus = null;
            input.onblur = null;
            input.oninput = null;
        };
    });
</script>

<div class="w-full relative flex flex-col gap-[14px]">
    <div class="flex flex-col gap-[8px]">
        <p class="font-medium text-[18px]/[22px] h-full">
            {option.name}
        </p>
        <p class="text-white/50 text-[16px]/[20px] flex flex-col gap-[8px]">
            {@html option.description}
        </p>
    </div>

    <div
        class="p-[18px] w-full flex gap-[18px] items-center border-2 bg-[#232323] rounded-[8px]"
        style="border-color: {$focused ? '#373737 !Important' : '#232323'}"
        class:rounded-bl-none={$focused &&
            ["role", "channel"].includes(option.type)}
        class:rounded-br-none={$focused &&
            ["role", "channel"].includes(option.type)}
        class:border-b-transparent={$focused &&
            ["role", "channel"].includes(option.type)}
    >
        {#if ["role", "channel", "text"].includes(option.type)}
            {#if option.type == "role"}
                <p class="font-bold">@</p>

                {#if option.value}
                    <button
                        on:click={() =>
                            $enabled &&
                            setting.enabled &&
                            (option.value = null)}
                        class="cursor-pointer flex items-center justify-center w-fit h-fit gap-[14px]"
                        class:cursor-pointer={$enabled && setting.enabled}
                    >
                        <div
                            class="h-[10px] aspect-square rounded-full"
                            style="background: #{!suggestions.find(
                                (r) => r.id == option.value,
                            ).colors.primary
                                ? 'c4c9ce'
                                : suggestions.find((r) => r.id == option.value)
                                      .colors.primary}"
                        ></div>
                        <p>
                            {suggestions.find((r) => r.id == option.value).name}
                        </p>
                    </button>
                {/if}
            {:else if option.type == "channel"}
                <p class="font-bold">#</p>

                {#if option.value}
                    <button
                        on:click={() =>
                            $enabled &&
                            setting.enabled &&
                            (option.value = null)}
                        class="cursor-pointer flex items-center justify-center w-fit h-fit gap-[14px] rounded-[8px]"
                        class:cursor-pointer={$enabled && setting.enabled}
                    >
                        <p>
                            {suggestions.find(
                                (r) => toString(r.id) == toString(option.value),
                            ).name}
                        </p>
                    </button>
                {/if}
            {/if}
            
            <input
                bind:this={input}
                class="outline-0 flex-1"
                class:hidden={option.value && option.type !== "text"}
                type="text"
                placeholder={option.name}
                aria-autocomplete="list"
                autocomplete="off"
            />
        {/if}

        {#if ["role", "channel"].includes(option.type)}
            <div
                class="
                absolute left-0 pt-0 p-[18px] w-full border-2 border-[#373737] bg-[#232323] flex flex-wrap rounded-[8px] border-t-[0]
                rounded-tl-none rounded-tr-none gap-[9px] self-start mt-[42px] z-100
                "
                class:hidden={!$focused}
            >
                {#each $filtered as suggestion}
                    <button
                        on:mousedown={() => {
                            option.value = suggestion.id;
                            input.value = "";
                            $filtered = suggestions;
                        }}
                        class="cursor-pointer flex items-center justify-center w-fit h-fit gap-[14px] p-[9px] px-[14px] rounded-[8px] border-2 border-[#373737]"
                    >
                        {#if option.type == "role"}
                            <div
                                class="h-[10px] aspect-square rounded-full"
                                style="background: #{!suggestion.colors.primary
                                    ? 'c4c9ce'
                                    : suggestion.colors.primary}"
                            ></div>
                            <p>
                                {suggestion.name}
                            </p>
                        {:else}
                            <p class="font-bold">#</p>
                            <p>
                                {suggestion.name}
                            </p>
                        {/if}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>
