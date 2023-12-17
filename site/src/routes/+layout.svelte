<script lang="ts">
    import '../app.css';
    import { Link, Settings } from '$lib/components/navbar';
    import { loadTranslations, t } from '$lib/translations';
    import { onMount } from 'svelte';
    import { semester } from '$lib/store';

    onMount(async () => {
        const initLocale = localStorage.getItem('locale') ?? 'en';

        const semesterStr = localStorage.getItem('semester');
        if (semesterStr === null) {
            $semester = await getSemester();
        } else {
            $semester = JSON.parse(semesterStr);
        }

        await loadTranslations(initLocale);
    });

    async function getSemester() {
        const sem: Semester = await (await fetch('/search/firebase/semester')).json();
        localStorage.setItem('semester', JSON.stringify(sem));
        return sem;
    }
</script>

<nav class="navbar py-0 bg-base-300">
    <div class="flex-1">
        <Link href="/">NTUMoons</Link>
        <Link href="/timetable">{$t('Nav.Timetable')}</Link>
    </div>
    <span class="mr-4 select-none">
        {$semester.title}
    </span>
    <div class="mr-4">
        <Settings href="/settings" />
    </div>
</nav>

<div class="p-12">
    <slot />
</div>
