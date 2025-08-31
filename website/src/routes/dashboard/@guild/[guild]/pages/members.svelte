<script module>
    import AssignmentIcon from "$lib/components/svgs/assignment_icon.svelte";

    export const data = {
        widget: {
            icon: AssignmentIcon,
            name: "Members",
        },
    };
</script>

<script>
    import GroupIcon from "$lib/components/svgs/group_icon.svelte";
    import PersonAlertIcon from "$lib/components/svgs/person_alert_icon.svelte";
    import { writable } from "svelte/store";

    export let data = writable(null);
    export let widget = false;

    let { guild } = $data;
</script>

{#if widget}
    <!-- Members -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-primary-accent/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <GroupIcon size={32} color={"#7289DA"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">
                {guild.memberCount}
            </p>
            <p class="text-white/50 text-[18px]/[22px]">Members</p>
        </div>
    </div>

    <!-- Verified -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-[#72DA9D]/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <AssignmentIcon size={32} color={"#72DA9D"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">
                {guild.memberCount}
            </p>
            <p class="text-white/50 text-[18px]/[22px]">Verified</p>
        </div>
    </div>

    <!-- Unverified -->
    <div class="bg-[#2D2D2D] h-[120px] rounded-[8px] p-[24px] flex gap-[18px]">
        <div
            class="h-full bg-[#DA7272]/15 flex items-center rounded-full justify-center aspect-square relative"
        >
            <PersonAlertIcon size={32} color={"#DA7272"} _class="opacity-[60%]" />
        </div>
        <div class="w-full h-full flex flex-col justify-center gap-[0px]">
            <p class="font-bold text-[24px]/[28px]">
                {guild.memberCount}
            </p>
            <p class="text-white/50 text-[18px]/[22px]">Unverified</p>
        </div>
    </div>
{/if}