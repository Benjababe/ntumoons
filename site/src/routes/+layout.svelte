<script lang="ts">
    import '../app.css';
    import { Link, Settings } from '$lib/components/navbar';
    import { loadTranslations, t } from '$lib/translations';
    import { onMount } from 'svelte';

    onMount(async () => {
        const initLocale = localStorage.getItem('locale') ?? 'en';
        await loadTranslations(initLocale);
    });
</script>

<nav class="navbar py-0 bg-base-300">
    <div class="flex-1">
        <Link href="/">NTUMoons</Link>
        <Link href="/timetable">{$t('Nav.Timetable')}</Link>
    </div>
    <div class="mr-4">
        <Settings href="/settings" />
    </div>
</nav>

<div class="p-12">
    <slot />
</div>
