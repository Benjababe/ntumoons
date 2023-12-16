<script lang="ts">
    import gearIcon from '$lib/assets/gear.svg?raw';

    export let href: string;
</script>

<a
    {href}
    class="fill-current p-3 rounded-lg hover:bg-base-content hover:bg-opacity-20"
>
    {@html gearIcon}
</a>
