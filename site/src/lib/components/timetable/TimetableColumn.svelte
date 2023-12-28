<script lang="ts">
    import TimetableCell from './TimetableCell.svelte';
    import {
        getColumnCells,
        calculateCellTopOffsets,
        getIntervals,
        intervalsToGroups,
        type ColCellDetails,
        type DayDetails
    } from './day-helper';

    export let lessons: Lesson[];
    export let day: string;
    export let startTime: number = 830;
    export let lastColumn: boolean = false;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let groups: ColCellDetails[][] = [];
    const dayDetails: DayDetails = { day, startTime, hourIntervalPercent: widthIntervalPercent };

    $: {
        const cells = getColumnCells(lessons, dayDetails);
        const intervals = getIntervals(cells);
        groups = intervalsToGroups(intervals);
        groups = calculateCellTopOffsets(groups);
    }
</script>

<li class="tt-day rounded-lg">
    <div class="tt-day-header border-neutral border-opacity-50 {lastColumn ? '' : 'border-r'}">
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
                        overlap={cellDetails.overlap}
                    />
                {/each}
            </div>
        {/each}
        <div></div>
    </div>
</li>

<style>
    .tt-day {
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: 3.5rem;
        min-width: 8rem;
    }

    .tt-day-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.5rem;
        font-weight: 600;
        border-style: solid;
        border-bottom-width: 1px;
    }
</style>
