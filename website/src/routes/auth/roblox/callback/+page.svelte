<script>
    import { onMount } from "svelte";

    export let data;

    onMount(() => {
        if (window.opener) {
            window.opener.postMessage(
                { type: "callback", data },
                window.location.origin, // must match the parent’s origin
            );
            window.close();
        } else window.location = "/";
    });
</script>