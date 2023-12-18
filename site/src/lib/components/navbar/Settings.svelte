<script lang="ts">
    import { page } from '$app/stores';
    import gearIcon from '$lib/assets/gear.svg?raw';

    export let href: string;
    $: fillColour = $page.url.pathname === href ? 'fill-primary' : '';
</script>

<a
    {href}
    class="fill-current p-3 rounded-lg hover:bg-base-content hover:bg-opacity-20 {fillColour}"
>
    {@html gearIcon}
</a>
