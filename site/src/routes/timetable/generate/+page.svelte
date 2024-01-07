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
    import type { GeneratePlanLimits, DayTimeRangesStr } from '$lib/types/Timetable';
    import TimetableGenerateFilters from './TimetableGenerateFilters.svelte';
    import Reload from '$lib/assets/images/Reload.svelte';
    import { DAYS_FULL } from '$lib/util';

    let getPlansPromise: Promise<GeneratePlanLimits>;
    let modules: Module[] = [];
    let plans: Lesson[][] = [];
    let planIndex: number = 0;
    let moduleIndexes: Record<string, string> = {};
    let dayFiltersStr: DayTimeRangesStr = DAYS_FULL.reduce((obj, day) => {
        obj[day] = [];
        return obj;
    }, {} as DayTimeRangesStr);

    $: {
        modules = $timetableModules[$activeSemester.id] ?? [];
        getPlansPromise = getPlans();
    }

    async function getPlans() {
        planIndex = 0;
        const res = await fetch('/timetable/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modules, dayFiltersStr })
        });
        const { generatedPlans, planLimit, iterLimit } = await res.json();
        plans = generatedPlans;
        movePlanIndex(0);
        return { planLimit, iterLimit } as GeneratePlanLimits;
    }

    function setTimetable() {
        const newModules = [...modules];

        for (const [code, index] of Object.entries(moduleIndexes)) {
            for (let i = 0; i < newModules.length; i++) {
                if (newModules[i].code === code) newModules[i].active_index_number = index;
            }
        }

        $timetableModules[$activeSemester.id] = newModules;
        returnTimetable();
    }

    function returnTimetable() {
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

<div>
    <div class="flex flex-col justify-center items-center">
        <h3 class="font-bold text-center text-2xl underline mb-4">
            {$t('Timetable.Generate.Timetable Generation')}
        </h3>
        <div class="flex justify-center w-full">
            <TimetableGenerateFilters bind:dayFilters={dayFiltersStr} />
        </div>
        <button
            class="btn btn-accent w-fit mb-6"
            on:click|preventDefault={() => {
                getPlansPromise = getPlans();
            }}
        >
            <Reload />
            <span class="mx-1">{$t('Timetable.Generate.Refresh')}</span>
        </button>
        {#await getPlansPromise}
            <div class="flex justify-center">
                <Spinner />
            </div>
        {:then data}
            {#if data.iterLimit}
                <div class="flex justify-center">
                    <div class="alert alert-warning font-semibold mb-4 w-fit">
                        <Info />
                        {$t(
                            'Timetable.Generate.Timetable generation has stopped after x combinations',
                            {
                                iterLimit: ITER_LIMIT
                            }
                        )}
                    </div>
                </div>
            {/if}
            {#if plans.length > 0}
                <div class="flex items-center gap-4 mb-4">
                    <button
                        class="btn btn-neutral"
                        on:click|preventDefault={() => movePlanIndex(-1)}
                    >
                        {$t('Timetable.Generate.Prev')}
                    </button>
                    <span>
                        {planIndex + 1} of {plans.length}
                    </span>
                    <button
                        class="btn btn-neutral"
                        on:click|preventDefault={() => movePlanIndex(1)}
                    >
                        {$t('Timetable.Generate.Next')}
                    </button>
                </div>
                {#if data.planLimit}
                    <div class="">
                        <div class="alert alert-warning font-semibold mb-4 w-fit">
                            {$t(
                                'Timetable.Generate.Over x possible timetable combinations have been found',
                                {
                                    planLimit: PLAN_LIMIT
                                }
                            )}
                        </div>
                    </div>
                {/if}
                <div class="w-full">
                    <Timetable
                        lessons={plans[planIndex]}
                        showIndex={true}
                    />
                </div>
                <div class="flex gap-x-4 mb-4">
                    <button
                        class="btn btn-primary"
                        on:click={setTimetable}
                    >
                        {$t('Timetable.Generate.Apply')}
                    </button>
                    <button
                        class="btn"
                        on:click={returnTimetable}
                    >
                        {$t('Timetable.Generate.Return')}
                    </button>
                </div>
            {:else}
                <div class="alert alert-error font-semibold mb-4 w-fit">
                    <Error />
                    {$t('Timetable.Generate.No combination was found without clashes')}
                </div>
            {/if}
        {/await}
    </div>
</div>
