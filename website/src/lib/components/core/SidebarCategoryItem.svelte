<script>
    import { writable } from "svelte/store";

    export let target;
    
    export let id;
    export let out = writable(null);
</script>

{#if target}
    <a class="flex flex-row gap-[18px] items-center select-none" href={target}>
        <slot />
    </a>
{/if}

{#if id} 
    <button onclick={() => $out = id} class="cursor-pointer flex flex-row gap-[18px] items-center transition-opacity duration-75 select-none" class:opacity-50={$out !== id} href={target}>
        <slot />
    </button>
{/if}