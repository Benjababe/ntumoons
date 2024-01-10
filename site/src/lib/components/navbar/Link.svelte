<script lang="ts">
    import { page } from '$app/stores';
    export let href: string;

    $: linkColour = $page.url.pathname.startsWith(href) ? 'text-primary' : 'hover:text-primary';
</script>

<a
    {href}
    class="inline-flex items-center justify-center h-12 min-h-[3rem] font-semibold text-2xl underline-offset-4 bg-base-300 hover:underline {linkColour} {$$props.class}"
>
    <slot />
</a>
