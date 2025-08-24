<script>
    import { page } from "$app/state";
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center text-4xl">
    <h1 class="font-bold">{page.status}</h1>
    <h1>{page.error.message}</h1>
</div>
