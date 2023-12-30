<script lang="ts">
    import ModuleSearch from './ModuleSearch.svelte';
    import ModuleTable from './ModuleTable.svelte';
    import { Timetable } from '$lib/components/timetable';
    import { timetableModules } from '$lib/stores';
    import type { Lesson } from '$lib/types/Firebase';
    import ClashingLessons from '$lib/components/timetable/ClashingLessons.svelte';

    export let data;
    let lessons: Lesson[] = [];

    $: {
        lessons = [];
        for (const mod of $timetableModules) {
            if (mod.active_index_number === '-1') continue;

            lessons = [...lessons, ...mod.index_numbers[mod.active_index_number]];
        }
    }
</script>

<div class="flex flex-col justify-center relative max-w-full">
    <Timetable {lessons} />
    <ClashingLessons class="mt-4" />
    <ModuleSearch modules={data.modules} />
    <ModuleTable />
</div>
