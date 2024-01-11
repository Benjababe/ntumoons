<script lang="ts">
    import '../app.css';
    import Logo from '$lib/assets/images/Logo.svelte';
    import { Link, Settings } from '$lib/components/navbar';
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import { activeSemester } from '$lib/stores';
    import type { Semester } from '$lib/types/Firebase';

    let semesters: Semester[] = [];

    onMount(async () => {
        semesters = await getAllSemesters();
    });

    async function getAllSemesters() {
        const semRes = (await (await fetch('/search/firebase/semester')).json()) as Semester[];
        return semRes;
    }

    function activeSemesterUpdate(e: Event) {
        const target = e.target as HTMLSelectElement;
        const semId = target.value;

        semesters.forEach((sem) => {
            if (sem.id === semId) $activeSemester = sem;
        });
    }
</script>

<nav class="flex justify-center bg-base-300">
    <div class="py-0 navbar max-w-1200">
        <div class="flex-1">
            <div class="px-4">
                <Link
                    class="group"
                    href="/"
                >
                    <div class="mr-2 transition-transform duration-300 group-hover:scale-120">
                        <Logo />
                    </div>
                    NTUMoons
                </Link>
            </div>
            <div class="px-4">
                <Link href="/timetable">{$t('Nav.Timetable')}</Link>
            </div>
            <div class="px-4">
                <Link href="/modules">{$t('Nav.Modules')}</Link>
            </div>
            <div class="px-4">
                <Link href="/staff">{$t('Nav.Staff')}</Link>
            </div>
        </div>
        <select
            class="mr-4 select"
            value={$activeSemester.id}
            on:change={activeSemesterUpdate}
        >
            {#each semesters as semester}
                <option value={semester.id}>{semester.title}</option>
            {/each}
        </select>
        <div class="mr-4">
            <Settings href="/settings" />
        </div>
    </div>
</nav>
