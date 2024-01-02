<script lang="ts">
    import { activeSemester, timetableModules } from '$lib/stores';
    import { flip } from 'svelte/animate';
    import ModuleTableCell from './ModuleTableCell.svelte';
    import { scale } from 'svelte/transition';
    import type { DispatchRemoveModule, DispatchUpdateIndex } from '$lib/types/Dispatch';

    function removeModule({ code }: DispatchRemoveModule) {
        $timetableModules[$activeSemester.id] = $timetableModules[$activeSemester.id].filter(
            (tm) => tm.code !== code
        );
    }

    function updateIndex({ code, index }: DispatchUpdateIndex) {
        $timetableModules[$activeSemester.id] = $timetableModules[$activeSemester.id].map((tm) => {
            if (tm.code === code) tm.active_index_number = index;
            return tm;
        });
    }
</script>

<div class="grid grid-cols-3 gap-6 z-0 px-4 py-2">
    {#each $timetableModules[$activeSemester.id] as mod (mod.code)}
        <div
            class="table-cell"
            in:scale
            out:scale
            animate:flip={{ duration: 300 }}
        >
            <ModuleTableCell
                {mod}
                on:remove={(e) => removeModule(e.detail)}
                on:updateIndex={(e) => updateIndex(e.detail)}
            />
        </div>
    {/each}
</div>
