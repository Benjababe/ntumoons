<script lang="ts">
    import type { Day, DayTimeRangesStr } from '$lib/types/Timetable';
    import { t } from '$lib/translations';
    import { DAYS_FULL } from '$lib/util';

    export let dayFilters: DayTimeRangesStr;

    const timeRanges: string[] = generateTimeRanges();
    const days: Day[] = DAYS_FULL;
    let dayIndex = 0;
    $: curDay = days[dayIndex];

    function generateTimeRanges() {
        const interval = 30;
        let curTime = 830;
        let timeRanges: string[] = [];

        while (curTime < 2030) {
            const l = (curTime < 1000 ? '0' : '') + curTime.toString();
            const r =
                (curTime < timeSum(1000, -interval) ? '0' : '') +
                timeSum(curTime, interval).toString();
            timeRanges = [...timeRanges, `${l} - ${r}`];
            curTime = timeSum(curTime, interval);
        }

        return timeRanges;
    }

    /**
     * Add or subtract a time by another time.
     * @param time Base time value.
     * @param add Time to add or subtract by.
     */
    function timeSum(time: number, add: number) {
        time += add;
        if (add > 0 && time % 100 === 60) time += 40;
        if (add < 0 && time % 100 === 70) time -= 40;
        return time;
    }

    function shiftDay(shift: number) {
        if ((dayIndex === 0 && shift < 0) || (dayIndex === days.length - 1 && shift > 0)) return;
        dayIndex += shift;
    }

    function fillDay() {
        dayFilters[curDay] = [...timeRanges];
    }

    function emptyDay() {
        dayFilters[curDay] = [];
    }
</script>

<div class="mb-6">
    <div class="collapse collapse-arrow w-full rounded-lg bg-base-300">
        <input type="checkbox" />
        <div class="collapse-title text-xl text-center font-medium">
            <span>{$t('Timetable.Generate.Choose Times Without Lessons')}</span>
        </div>
        <div class="collapse-content px-12">
            <div class="flex flex-col items-center justify-center">
                <div class="flex justify-center items-center gap-x-4 mb-4">
                    <button
                        disabled={curDay === 'MON'}
                        class="btn btn-sm btn-neutral"
                        on:click|preventDefault={() => shiftDay(-1)}
                    >
                        {'<'}
                    </button>
                    <span class="font-semibold text-xl text-center w-16">
                        {curDay}
                    </span>
                    <button
                        disabled={curDay === 'SAT'}
                        class="btn btn-sm btn-neutral"
                        on:click|preventDefault={() => shiftDay(1)}
                    >
                        {'>'}
                    </button>
                </div>
                <div class="grid grid-cols-4 gap-x-8 gap-y-4 mb-6">
                    {#each timeRanges as timeRange}
                        <div>
                            <label class="label cursor-pointer">
                                <input
                                    class="checkbox checkbox-xs checkbox-primary"
                                    type="checkbox"
                                    value={timeRange}
                                    bind:group={dayFilters[curDay]}
                                />
                                <span class="label-text ml-1">
                                    {timeRange}
                                </span>
                            </label>
                        </div>
                    {/each}
                </div>
                <div class="flex justify-center gap-x-4">
                    <button
                        class="btn btn-primary"
                        on:click|preventDefault={fillDay}
                    >
                        {$t('Timetable.Generate.Select All')}
                    </button>
                    <button
                        class="btn btn-neutral"
                        on:click|preventDefault={emptyDay}
                    >
                        {$t('Timetable.Generate.Clear')}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
