<script lang="ts">
    import TimetableCell from './TimetableCell.svelte';
    import {
        calculateCellLeftOffsets,
        getRowCells,
        getIntervals,
        intervalsToGroups,
        type RowCellDetails,
        type DayDetails
    } from './day-helper';

    export let lessons: Lesson[];
    export let day: string;
    export let startTime: number = 830;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let groups: RowCellDetails[][] = [];
    const dayDetails: DayDetails = { day, startTime, hourIntervalPercent: widthIntervalPercent };

    $: {
        const cells = getRowCells(lessons, dayDetails);
        const intervals = getIntervals(cells);
        groups = intervalsToGroups(intervals);
        groups = calculateCellLeftOffsets(groups);
    }
</script>

<li class="tt-row border-neutral border-opacity-50">
    <div class="tt-row-day border-neutral border-opacity-50">
        {day}
    </div>
    <div class="relative w-full bg-tt-loop bg-tt-alternate-h">
        {#each groups as group}
            <div class="flex py-1 relative">
                {#each group as cellDetails (cellDetails.id)}
                    <TimetableCell
                        left={cellDetails.left}
                        width={cellDetails.width}
                        lesson={cellDetails.lesson}
                        overlap={cellDetails.overlap}
                    />
                {/each}
            </div>
        {/each}
    </div>
</li>

<style>
    .tt-row {
        display: flex;
        position: relative;
        min-height: 5rem;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }

    .tt-row:last-child {
        border-bottom: 0px;
    }

    .tt-row-day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.5rem;
        font-weight: 600;
        border-style: solid;
        border-right-width: 1px;
    }
</style>
