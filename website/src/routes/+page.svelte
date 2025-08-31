<script>
    import { preloadData } from '$app/navigation';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    export let data;
    data = writable(data);

    let user = writable($data.user);

    function promptLogin() {
        let width = 600;
        let height = 800;

        const screenLeft =
            window.screenLeft !== undefined
                ? window.screenLeft
                : window.screenX;
        const screenTop =
            window.screenTop !== undefined ? window.screenTop : window.screenY;

        // Get window inner dimensions
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        // Calculate top and left to center the popup
        const left = screenLeft + (innerWidth - width) / 2;
        const top = screenTop + (innerHeight - height) / 2;

        const url = `/auth/discord/login`;

        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no`;

        window.open(url, "_blank", features);
    }

    onMount(async () => {
        let listener = window.addEventListener("message", async (event) => {
            if (event.origin !== window.location.origin) return; // security check
            if (event.data.type === "callback") {
                let data = event.data.data;

                const { error, error_description, user: loggedInAs = undefined, session_id, user_data } = data;

                if (!error && loggedInAs) {
                    $user = loggedInAs;
                    preloadData("/dashboard");
                }
            }
        });

        return () => {
            removeEventListener("message", listener);
        };
    });
</script>

<div class="p-[20px] flex flex-col gap-[10px]">
    <div class="flex flex-col gap-[10px]">
        Welcome to Voxar!
        {#if $user}
            <a href="/dashboard" class="rounded-xl w-fit p-[15px] bg-white/10"
                >Dashboard</a
            >
        {:else}
            <button
                on:click={promptLogin}
                class="bg-white/10 p-[15px] rounded-xl w-fit cursor-pointer">Login</button
            >
        {/if}
    </div>
</div>
