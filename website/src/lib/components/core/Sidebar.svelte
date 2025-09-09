<script>
    import DiscordIcon from "$lib/components/svgs/discord_icon.svelte";
    import DashboardIcon from "$lib/components/svgs/dashboard_icon.svelte";
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import KeyboardIcon from "$lib/components/svgs/keyboard_icon.svelte";
    import SortIcon from "$lib/components/svgs/sort_icon.svelte";
    import ExtensionIcon from "$lib/components/svgs/extension_icon.svelte";
    import ArrowLeftIcon from "$lib/components/svgs/arrow_left_icon.svelte";
    import LogoutIcon from "$lib/components/svgs/logout_icon.svelte";

    import SidebarCategory from "./SidebarCategory.svelte";
    import SidebarCategoryItem from "./SidebarCategoryItem.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    export let data = writable(null);

    const { user, guild } = $data;
</script>

<div
    class="w-fit min-w-[320px] max-w-[340px] h-screen overflow-y-scroll pl-[96px] pt-[96px] pb-[96px] flex flex-col justify-between text-[18px] font-[500] relative gap-[96px]"
>
    <!-- Navigation -->
    <div class="h-fit w-full relative flex flex-col gap-[30px] pl-[18px]">
        <slot />
    </div>

    <!-- User information -->
    <div class="h-fit max-w-full w-full relative flex flex-col gap-[18px]">
        <div class="pl-[24px] flex flex-col gap-[10px] text-[#FF5757]">
            <SidebarCategoryItem target="/auth/discord/logout">
                <LogoutIcon size={30} color={"#FF5757"} />
                <p>Logout</p>
            </SidebarCategoryItem>
        </div>
        <div
            class="flex bg-primary-bg flex-row gap-[18px] min-w-[100%] items-center justify-center w-fit max-w-full h-fit relative px-[24px] py-[18px] overflow-hidden rounded-full border-2 border-primary-accent/50"
        >
            <div
                class="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_#7289DABF,_#7289DA40)] opacity-[45%]"
            ></div>
            <DiscordIcon size="30" />
            <p class="relative ellipsis flex-1 select-none">{$data.user.username}</p>
        </div>
    </div>
</div>