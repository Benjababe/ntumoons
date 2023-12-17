<script lang="ts">
    import crossIcon from '$lib/assets/cross.svg?raw';
    import { timetableModules, semester } from '$lib/store';
    import { t } from '$lib/translations';

    function removeModule(moduleCode: string) {
        $timetableModules = $timetableModules.filter((tm) => tm.code !== moduleCode);
    }
</script>

<div class="grid grid-cols-3 gap-6 z-0 px-4 py-2">
    {#each $timetableModules as mod}
        <div class="table-cell">
            <div class="float-right h-fit mt-1 mr-4">
                <button
                    class="btn-outline rounded-full"
                    on:click|preventDefault={() => removeModule(mod.code)}
                >
                    {@html crossIcon}
                </button>
            </div>
            <a
                href="/modules/{$semester.id}/{mod.code}"
                class="capitalize text-primary"
            >
                {mod.code}
                {mod.name_pretty}
            </a>
            <div class="text-sm">
                {#if mod.exam !== null}
                    <span>
                        Exam:
                        {mod.exam.date}
                        {mod.exam.time}
                    </span>
                {:else}
                    <span>{$t('Timetable.No exam for this module.')}</span>
                {/if}
                <span>-- {mod.credits} CU</span>
            </div>
        </div>
    {/each}
</div>
