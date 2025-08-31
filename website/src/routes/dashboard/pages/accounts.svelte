<script>
    import Loader from "$lib/components/helper/Loader.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let data = writable(null);

    let { user, user_data } = $data;

    $: $data.user_data = user_data;

    let promptOpen = false;

    function promptLink() {
        let width = 600;
        let height = 800;
        promptOpen = true;

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

        const url = `/auth/roblox/link`;

        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no`;

        let win = window.open(url, "_blank", features);
        let interval = setInterval(() => {
            if (!win.window) {
                promptOpen = false;
                clearInterval(interval);
            }
        }, 100);

        return interval;
    }

    async function unlink(id) {
        user_data = {
            ...user_data,
            linkedAccounts: [
                ...user_data.linkedAccounts.map((a) => ({
                    ...a,
                    loader: a.id === id,
                })),
            ],
        };

        const res = await fetch(`/auth/roblox/unlink/${id}`);

        if (!res.ok) return console.log("Failed!");

        user_data = {
            ...user_data,
            linkedAccounts: [
                ...user_data.linkedAccounts.filter((a) => a.id !== id),
            ],
        };
    }

    let promptInterval = null;

    onMount(async () => {
        let listener = window.addEventListener("message", async (event) => {
            if (event.origin !== window.location.origin) return; // security check
            if (event.data.type === "callback") {
                promptOpen = false;
                if (promptInterval) {
                    clearInterval(promptInterval);
                    promptInterval = null;
                }

                let data = event.data.data;

                const { error, error_description, id, user: loggedInAs } = data;

                if (error) console.log(error, error_description);

                if (!error && id) {
                    if (!user_data.linkedAccounts.find((r) => r.id === id))
                        user_data = {
                            ...user_data,
                            linkedAccounts: [
                                ...user_data.linkedAccounts,
                                { id, username: loggedInAs.preferred_username },
                            ],
                        };
                }
            }
        });

        return () => {
            removeEventListener("message", listener);
        };
    });
</script>

<div class="flex flex-col gap-[10px]">
    {#if user && user.username}
        <div class="flex gap-[10px] items-center">
            <p class="font-bold">Here are your linked roblox accounts</p>
            <button
                on:click={() =>
                    !promptOpen ? (promptInterval = promptLink()) : null}
                class="bg-white/25 p-[15px] rounded-xl w-fit"
                class:cursor-pointer={!promptOpen}
                class:cursor-not-allowed={promptOpen}
                >{#if !promptOpen}
                    Link account
                {:else}
                    <Loader size="36" />
                {/if}</button
            >
        </div>
    {/if}
</div>

{#each user_data.linkedAccounts as linkedAccount}
    <div class="flex gap-[15px] items-center">
        <span>{linkedAccount.username}</span>
        <button
            on:click={() => unlink(linkedAccount.id)}
            class="p-[15px] bg-white/5"
            >{#if !linkedAccount.loader}
                Unlink
            {:else}
                <Loader size={24} />
            {/if}</button
        >
    </div>
{/each}
