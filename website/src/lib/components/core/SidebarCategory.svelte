<script>
    export let categoryName;
</script>

<div class="flex flex-col gap-[10px]">
    {#if categoryName}
        <p class="text-white/25 text-[16px] font-bold select-none">
            {categoryName.toUpperCase()}
        </p>
    {/if}
    <slot />
</div>
