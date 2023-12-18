<script lang="ts">
    import ModuleSearch from './ModuleSearch.svelte';
    import ModuleTable from './ModuleTable.svelte';
    import { TimetableModule } from '$lib/components/timetable';
</script>

<div class="flex flex-col justify-center relative max-w-full">
    <TimetableModule />
    <ModuleSearch />
    <ModuleTable />
</div>
