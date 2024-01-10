<script lang="ts">
    import ModuleSearch from './ModuleSearch.svelte';
    import ModuleTable from './ModuleTable.svelte';
    import { Timetable } from '$lib/components/timetable';
    import { timetableModules, activeSemester } from '$lib/stores';
    import type { Lesson } from '$lib/types/Firebase';
    import ClashingLessons from '$lib/components/timetable/ClashingLessons.svelte';
    import { t } from '$lib/translations';

    export let data;
    let lessons: Lesson[] = [];

    $: {
        lessons = [];
        if (!$timetableModules[$activeSemester.id]) $timetableModules[$activeSemester.id] = [];

        const semesterModules = $timetableModules[$activeSemester.id];
        for (const mod of semesterModules) {
            if (mod.active_index_number === '-1') continue;

            lessons = [...lessons, ...mod.index_numbers[mod.active_index_number]];
        }
    }
</script>

<div class="flex flex-col justify-center relative max-w-full">
    {#if $timetableModules[$activeSemester.id].length > 0}
        <div class="flex justify-center mb-4">
            <a
                class="btn btn-primary"
                href="/timetable/generate"
            >
                {$t('Timetable.Generate Timetable')}
            </a>
        </div>
    {/if}
    <Timetable {lessons} />
    <div class="mt-4">
        <ClashingLessons />
    </div>
    <div class="mt-4">
        <ModuleSearch modules={data.modules[$activeSemester.id]} />
    </div>
    <div class="mt-4">
        <ModuleTable />
    </div>
</div>
