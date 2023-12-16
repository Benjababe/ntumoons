<script lang="ts">
    export let href: string;
</script>

<a
    {href}
    class="bg-base-300 hover:text-accent"
>
    <slot />
</a>

<style>
    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 3rem;
        min-height: 3rem;
        padding-inline: 1rem;
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 2rem;
        text-underline-offset: 4px;
    }

    a:hover {
        text-decoration-line: underline;
    }
</style>
