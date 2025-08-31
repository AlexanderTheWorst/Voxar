<script>
    import Sidebar from "$lib/components/core/Sidebar.svelte";
    import SidebarCategory from "$lib/components/core/SidebarCategory.svelte";
    import SidebarCategoryItem from "$lib/components/core/SidebarCategoryItem.svelte";
    import ArrowLeftIcon from "$lib/components/svgs/arrow_left_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import DashboardIcon from "$lib/components/svgs/dashboard_icon.svelte";
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import KeyboardIcon from "$lib/components/svgs/keyboard_icon.svelte";
    import PuzzleIcon from "$lib/components/svgs/puzzle_icon.svelte";
    import SortIcon from "$lib/components/svgs/sort_icon.svelte";
    import { writable } from "svelte/store";
    import SettingsIcon from "../svgs/settings_icon.svelte";

    export let data = null;
    export let out = writable(null);

    const { guild, user } = data;
</script>

<Sidebar {data}>
    <SidebarCategory>
        <SidebarCategoryItem {out} id={"servers"}>
            <GroupIcon size={30} />
            <p>Servers</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"accounts"}>
            <AssignmentIcon size={30} />
            <p>Accounts</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"settings"}>
            <SettingsIcon size={30} />
            <p>Settings</p>
        </SidebarCategoryItem>
    </SidebarCategory>
</Sidebar>