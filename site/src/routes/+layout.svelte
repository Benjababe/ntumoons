<script lang="ts">
    import '../app.css';
    import { loadTranslations, t } from '$lib/translations';
    import { onMount } from 'svelte';
    import { semester } from '$lib/stores';
    import type { Semester } from '$lib/types/Firebase';
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';

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

<svelte:head>
    <title>{$t('NTUMoons')}</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex flex-1 justify-center pt-12 pb-24">
        <div class="w-4/5 max-w-1200">
            <slot />
        </div>
    </div>
    <Footer />
</div>
