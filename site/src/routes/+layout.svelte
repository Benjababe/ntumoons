<script lang="ts">
    import '../app.css';
    import { Link, Settings } from '$lib/components/navbar';
    import { loadTranslations, t } from '$lib/translations';
    import { onMount } from 'svelte';
    import { semester } from '$lib/stores';

    onMount(async () => {
        const initLocale = localStorage.locale ?? 'en';
        await loadTranslations(initLocale);

        if (!$semester.active) $semester = await getSemester();
    });

    async function getSemester() {
        console.log('Fetching latest semester...');
        const semData = (await (await fetch('/search/firebase/semester')).json()) as Semester;
        return semData;
    }
</script>

<nav class="navbar py-0 bg-base-300">
    <div class="flex-1">
        <Link href="/">NTUMoons</Link>
        <Link href="/timetable">{$t('Nav.Timetable')}</Link>
        <Link href="/modules">{$t('Nav.Modules')}</Link>
    </div>
    <span class="mr-4 select-none">
        {$semester.title}
    </span>
    <div class="mr-4">
        <Settings href="/settings" />
    </div>
</nav>

<div class="flex justify-center pt-12 pb-24">
    <div class="min-w-3/5 max-w-4/5">
        <slot />
    </div>
</div>
