<script>
    import { page } from "$app/state";
</script>

<div class="w-screen h-screen flex flex-row gap-[20px] items-center justify-center text-3xl">
    <h1 class="font-bold">{page.status}</h1>
    <div class="h-[3rem] w-[1px] bg-black/25"></div>
    <h1 class="text-2xl">{page.error.message}</h1>
</div>
