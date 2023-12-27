<script lang="ts">
    import { page } from '$app/stores';
    import Gear from '$lib/assets/images/Gear.svelte';

    export let href: string;
    $: fillColour = $page.url.pathname === href ? 'fill-primary' : '';
</script>

<a
    {href}
    class="fill-current p-3 rounded-lg hover:bg-base-content hover:bg-opacity-20 {fillColour}"
>
    <Gear />
</a>
