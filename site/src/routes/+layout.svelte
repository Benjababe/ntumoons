<script lang="ts">
    import '../app.css';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { loadTranslations, t } from '$lib/translations';
    import { onMount } from 'svelte';
    import { activeSemester } from '$lib/stores';
    import type { Semester } from '$lib/types/Firebase';
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';

    inject({ mode: dev ? 'development' : 'production' });

    onMount(async () => {
        const initLocale = localStorage.locale ?? 'en';
        await loadTranslations(initLocale);

        if ($activeSemester.default) $activeSemester = await getSemester();
    });

    async function getSemester() {
        const semRes = (await (await fetch('/search/firebase/semester')).json()) as Semester[];
        for (let i = 0; i < semRes.length; i++) {
            if (semRes[i].active) return semRes[i];
        }
        return $activeSemester;
    }
</script>

<svelte:head>
    <title>{$t('NTUMoons')}</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex justify-center flex-1 pt-12 pb-24">
        <div class="w-4/5 max-w-1200">
            <slot />
        </div>
    </div>
    <Footer />
</div>
