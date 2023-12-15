<script lang="ts">
    import '../app.css';
    import gearIcon from '$lib/assets/gear.svg?raw';
    import { loadTranslations } from '$lib/translations';
    import { onMount } from 'svelte';

    onMount(async () => {
        const initLocale = localStorage.getItem('locale') ?? 'en';
        await loadTranslations(initLocale);
    });
</script>

<nav class="navbar py-0 bg-base-300">
    <div class="flex-1">
        <a
            href="/"
            class="btn btn-ghost text-2xl">NTUMoons</a
        >
    </div>
    <div class="mr-4">
        <a
            href="/settings"
            class="fill-current p-3 rounded-lg hover:bg-base-content hover:bg-opacity-20"
        >
            {@html gearIcon}
        </a>
    </div>
</nav>

<div class="p-12">
    <slot />
</div>
