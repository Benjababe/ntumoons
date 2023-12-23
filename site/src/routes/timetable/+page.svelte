<script lang="ts">
    import ModuleSearch from './ModuleSearch.svelte';
    import ModuleTable from './ModuleTable.svelte';
    import { TimetableModule } from '$lib/components/timetable';
    import { timetableModules } from '$lib/stores';

    let lessons: Lesson[] = [];

    $: {
        lessons = [];
        for (const module of $timetableModules) {
            if (module.active_index_number === '-1') continue;

            const indexNumber = parseInt(module.active_index_number);
            lessons = [...lessons, ...module.index_numbers[indexNumber]];
        }
    }
</script>

<div class="flex flex-col justify-center relative max-w-full">
    <TimetableModule {lessons} />
    <ModuleSearch />
    <ModuleTable />
</div>
