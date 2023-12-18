<script lang="ts">
    import { timetableModules } from '$lib/stores';
    import ModuleTableCell from './ModuleTableCell.svelte';

    function removeModule(e: CustomEvent<{ code: string }>) {
        $timetableModules = $timetableModules.filter((tm) => tm.code !== e.detail.code);
        Object.keys($timetableModules[0].index_numbers);
    }

    function updateIndex(e: CustomEvent<{ code: string; index: string }>) {
        const { code, index } = e.detail;

        $timetableModules = $timetableModules.map((tm) => {
            if (tm.code === code) tm.active_index_number = index;
            return tm;
        });
    }
</script>

<div class="grid grid-cols-3 gap-6 z-0 px-4 py-2">
    {#each $timetableModules as mod}
        <ModuleTableCell
            {mod}
            on:remove={removeModule}
            on:updateIndex={updateIndex}
        />
    {/each}
</div>
