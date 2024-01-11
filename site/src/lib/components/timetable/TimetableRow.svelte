<script lang="ts">
    import { timetableClashes } from '$lib/stores/timetable';
    import type { Lesson } from '$lib/types/Firebase';
    import type { Day, DayDetails, RowCellDetails } from '$lib/types/Timetable';
    import TimetableCell from './TimetableCell.svelte';
    import {
        calculateCellLeftOffsets,
        getRowCells,
        getIntervals,
        intervalsToGroups,
        getDayClashes
    } from './day-helper';

    export let lessons: Lesson[];
    export let day: Day;
    export let startTime: number = 830;
    export let showIndex: boolean = false;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let groups: RowCellDetails[][] = [];
    const dayDetails: DayDetails = { day, startTime, hourIntervalPercent: widthIntervalPercent };

    $: {
        const cells = getRowCells(lessons, dayDetails);
        const intervals = getIntervals(cells);
        groups = intervalsToGroups(intervals);
        groups = calculateCellLeftOffsets(groups);

        $timetableClashes[day] = getDayClashes(intervals);
    }
</script>

<li
    class="flex relative min-h-[3.5rem] border-b border-solid border-neutral border-opacity-50 last:border-b-0"
>
    <div
        class="flex items-center justify-center font-semibold border-r border-opacity-50 border-solid w-14 border-neutral"
    >
        {day}
    </div>
    <div class="relative w-full bg-tt-loop bg-tt-alternate-h">
        {#each groups as group}
            <div class="relative flex py-1">
                {#each group as cellDetails (cellDetails.id)}
                    <TimetableCell
                        left={cellDetails.left}
                        width={cellDetails.width}
                        lesson={cellDetails.lesson}
                        clashing={cellDetails.clashing}
                        {showIndex}
                    />
                {/each}
            </div>
        {/each}
    </div>
</li>
