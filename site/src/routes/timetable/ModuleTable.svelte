<script lang="ts">
    import { timetableModules } from '$lib/stores';
    import { flip } from 'svelte/animate';
    import ModuleTableCell from './ModuleTableCell.svelte';
    import { scale } from 'svelte/transition';

    function removeModule({ code }: DispatchRemoveModule) {
        $timetableModules = $timetableModules.filter((tm) => tm.code !== code);
    }

    function updateIndex({ code, index }: DispatchUpdateIndex) {
        $timetableModules = $timetableModules.map((tm) => {
            if (tm.code === code) tm.active_index_number = index;
            return tm;
        });
    }
</script>

<div class="grid grid-cols-3 gap-6 z-0 px-4 py-2">
    {#each $timetableModules as mod (mod.code)}
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
