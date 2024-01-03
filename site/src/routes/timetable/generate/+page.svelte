<script lang="ts">
    import Timetable from '$lib/components/timetable/Timetable.svelte';
    import { t } from '$lib/translations';
    import { timetableModules, activeSemester } from '$lib/stores';
    import type { Lesson, Module } from '$lib/types/Firebase';
    import { ITER_LIMIT, PLAN_LIMIT } from './helper';
    import Error from '$lib/assets/images/Error.svelte';
    import Info from '$lib/assets/images/Info.svelte';
    import Spinner from '$lib/components/generic/Spinner.svelte';
    import { goto } from '$app/navigation';

    let modules: Module[];
    let plans: Lesson[][] = [];
    let planIndex: number = 0;
    let moduleIndexes: Record<string, string> = {};

    $: modules = $timetableModules[$activeSemester.id] ?? [];

    async function getPlans() {
        planIndex = 0;
        const res = await fetch('/timetable/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modules })
        });
        const { generatedPlans, planLimit, iterLimit } = await res.json();
        plans = generatedPlans;
        movePlanIndex(0);
        return { planLimit, iterLimit } as { planLimit: boolean; iterLimit: boolean };
    }

    function setTimetable() {
        const newModules = [...modules];

        for (const [code, index] of Object.entries(moduleIndexes)) {
            for (let i = 0; i < newModules.length; i++) {
                if (newModules[i].code === code) newModules[i].active_index_number = index;
            }
        }

        $timetableModules[$activeSemester.id] = newModules;
        goto('/timetable');
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

<div class="">
    <div class="">
        <h3 class="font-bold text-center text-2xl underline mb-4">
            {$t('Timetable.Timetable Generation')}
        </h3>

        {#await getPlans()}
            <Spinner />
        {:then data}
            {#if data.iterLimit}
                <div class="flex justify-center">
                    <div class="alert alert-warning font-semibold mb-4 w-fit">
                        <Info />
                        {$t('Timetable.Timetable generation has stopped after x combinations', {
                            iterLimit: ITER_LIMIT
                        })}
                    </div>
                </div>
            {/if}
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
                {#if data.planLimit}
                    <div class="flex justify-center">
                        <div class="alert alert-warning font-semibold mb-4 w-fit">
                            {$t(
                                'Timetable.Over x possible timetable combinations have been found',
                                {
                                    planLimit: PLAN_LIMIT
                                }
                            )}
                        </div>
                    </div>
                {/if}
                <Timetable
                    lessons={plans[planIndex]}
                    showIndex={true}
                />
                <div class="flex justify-center">
                    <button
                        class="btn btn-primary"
                        on:click={setTimetable}
                    >
                        {$t('Timetable.Apply')}
                    </button>
                </div>
            {:else}
                <div class="flex justify-center">
                    <div class="alert alert-error font-semibold mb-4 w-fit">
                        <Error />
                        {$t('Timetable.No combination was found without clashes')}
                    </div>
                </div>
            {/if}
        {/await}
    </div>
</div>
