<script>
    import Sidebar from "$lib/components/core/Sidebar.svelte";
    import SidebarCategory from "$lib/components/core/SidebarCategory.svelte";
    import SidebarCategoryItem from "$lib/components/core/SidebarCategoryItem.svelte";
    import ArrowLeftIcon from "$lib/components/svgs/arrow_left_icon.svelte";
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";
    import DashboardIcon from "$lib/components/svgs/dashboard_icon.svelte";
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import KeyboardIcon from "$lib/components/svgs/keyboard_icon.svelte";
    import ExtensionIcon from "$lib/components/svgs/extension_icon.svelte";
    import SortIcon from "$lib/components/svgs/sort_icon.svelte";
    import { writable } from "svelte/store";
    import KeyIcon from "../svgs/key_icon.svelte";
    import { getContext } from "svelte";

    let { data, out } = getContext("globals");

    const { guild, user} = $data;
</script>

<Sidebar {data}>
    <SidebarCategoryItem target={"/dashboard"}>
        <ArrowLeftIcon size={30} />
        <p>{$data.guild.name}</p>
    </SidebarCategoryItem>

    <!-- Discord related -->
    <SidebarCategory>
        <SidebarCategoryItem {out} id={"overview"}>
            <DashboardIcon size={30} />
            <p>Overview</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"modules"}>
            <ExtensionIcon size={30} />
            <p>Modules</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"commands"}>
            <KeyboardIcon size={30} />
            <p>Commands</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"members"}>
            <AssignmentIcon size={30} />
            <p>Members</p>
        </SidebarCategoryItem>
    </SidebarCategory>

    <!-- Roblox related -->
    <SidebarCategory>
        <SidebarCategoryItem {out} id={"group"}>
            <GroupIcon size={30} />
            <p>Group</p>
        </SidebarCategoryItem>
        <SidebarCategoryItem {out} id={"roles"}>
            <SortIcon size={30} />
            <p>Roles</p>
        </SidebarCategoryItem>
    </SidebarCategory>
</Sidebar>