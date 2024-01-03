<script lang="ts">
    import NewTab from '$lib/assets/images/NewTab.svelte';
    import sanitizeHtml from 'sanitize-html';

    export let url = '';
    export let text = '';
    export let isRawHtml = false;
</script>

<a
    href={url}
    target="_blank"
    class="flex items-center gap-x-1 {$$props.class}"
>
    {#if isRawHtml}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html sanitizeHtml(text)}
    {:else}
        {text}
    {/if}
    <NewTab />
</a>
