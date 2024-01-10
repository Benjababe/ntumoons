<script lang="ts">
    import type { Lesson } from '$lib/types/Firebase';
    import type { ColCellDetails, DayDetails } from '$lib/types/Timetable';
    import TimetableCell from './TimetableCell.svelte';
    import {
        getColumnCells,
        calculateCellTopOffsets,
        getIntervals,
        intervalsToGroups
    } from './day-helper';

    export let lessons: Lesson[];
    export let day: string;
    export let startTime: number = 830;
    export let lastColumn: boolean = false;
    export let showIndex: boolean = false;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let groups: ColCellDetails[][] = [];
    const dayDetails: DayDetails = { day, startTime, hourIntervalPercent: widthIntervalPercent };
    const lastColClass = lastColumn ? '' : 'border-r';

    $: {
        const cells = getColumnCells(lessons, dayDetails);
        const intervals = getIntervals(cells);
        groups = intervalsToGroups(intervals);
        groups = calculateCellTopOffsets(groups);
    }
</script>

<li class="flex flex-col relative min-h-[3.5rem] min-w-[8rem] rounded-lg">
    <div
        class="flex justify-center items-center h-14 font-semibold border-solid border-b border-neutral border-opacity-50 {lastColClass}"
    >
        {day}
    </div>
    <div class="flex relative h-full bg-tt-alternate-v bg-tt-loop pl-1 rounded-lg">
        {#each groups as group}
            <div class="flex flex-col">
                {#each group as cellDetails}
                    <TimetableCell
                        top={cellDetails.top}
                        height={cellDetails.height}
                        lesson={cellDetails.lesson}
                        clashing={cellDetails.clashing}
                        {showIndex}
                    />
                {/each}
            </div>
        {/each}
        <div></div>
    </div>
</li>
