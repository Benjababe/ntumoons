<script lang="ts">
    import Timetable from '$lib/components/timetable/Timetable.svelte';
    import { t } from '$lib/translations';
    import { timetableModules, activeSemester } from '$lib/stores';
    import type { Lesson, Module } from '$lib/types/Firebase';
    import { generateTimetable, PLAN_LIMIT } from './helper';

    let modules: Module[];
    let dialog: HTMLDialogElement;
    let plans: Lesson[][] = [];
    let planIndex: number = 0;
    let moduleIndexes: Record<string, string> = {};

    $: modules = $timetableModules[$activeSemester.id] ?? [];

    function generateBtnPress() {
        dialog.showModal();
        planIndex = 0;
        plans = generateTimetable(modules);
    }

    function setTimetable() {
        const newModules = [...modules];

        for (const [code, index] of Object.entries(moduleIndexes)) {
            for (let i = 0; i < newModules.length; i++) {
                if (newModules[i].code === code) newModules[i].active_index_number = index;
            }
        }

        $timetableModules[$activeSemester.id] = newModules;
    }

    function movePlanIndex(adjust: number) {
        const newIndex = planIndex + adjust;
        if (newIndex < 0 || newIndex >= plans.length) return;
        planIndex = newIndex;

        for (const lesson of plans[planIndex]) {
            moduleIndexes[lesson.module_code] = lesson.index;
        }
    }
</script>

<div class="flex justify-center mb-4">
    <button
        class="btn btn-primary"
        on:click|preventDefault={generateBtnPress}>{$t('Timetable.Generate Timetable')}</button
    >
</div>

<dialog
    class="modal modal-bottom sm:modal-middle"
    bind:this={dialog}
>
    <div class="modal-box !w-screen-80 !max-w-1200">
        <h3 class="font-bold text-xl underline mb-4">
            {$t('Timetable.Timetable Generation')}
        </h3>
        {#if plans.length > 0}
            <div class="flex justify-center items-center gap-4 mb-4">
                <button
                    class="btn"
                    on:click={() => movePlanIndex(-1)}
                >
                    {$t('Timetable.Prev')}
                </button>
                <span>
                    {planIndex + 1} of {plans.length}
                </span>
                <button
                    class="btn"
                    on:click={() => movePlanIndex(1)}
                >
                    {$t('Timetable.Next')}
                </button>
            </div>
            {#if plans.length >= PLAN_LIMIT}
                <div class="flex justify-center">
                    <div class="alert alert-warning font-semibold mb-4 w-fit">
                        {$t('Timetable.Over x possible timetable combinations have been found', {
                            planLimit: PLAN_LIMIT
                        })}
                    </div>
                </div>
            {/if}
            <Timetable lessons={plans[planIndex]} />
        {/if}
        <div class="modal-action !justify-center">
            <form method="dialog">
                <button
                    class="btn btn-primary"
                    on:click={setTimetable}
                >
                    {$t('Timetable.Apply')}
                </button>
                <button class="btn ml-2">{$t('Timetable.Close')}</button>
            </form>
        </div>
    </div>
    <form
        method="dialog"
        class="modal-backdrop"
    >
        <button class="cursor-default">Close but this shouldn't be seen xd</button>
    </form>
</dialog>
