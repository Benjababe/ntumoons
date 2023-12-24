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

<li class="tt-day border-neutral">
    <div class="tt-day-header border-neutral">
        {day}
    </div>
    <div class="relative h-full tt-day-content pl-1">
        {#each groups as group}
            <div class="flex flex-col">
                {#each group as cellDetails}
                    <TimetableCell
                        top={cellDetails.top}
                        height={cellDetails.height}
                        lesson={cellDetails.lesson}
                        overlap={cellDetails.overlap}
                        squeeze={cellDetails.squeeze}
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
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }

    .tt-day:last-child {
        border-bottom: 0px;
    }

    .tt-day-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.5rem;
        font-weight: 600;
        border-style: solid;
        border-right-width: 1px;
        border-bottom-width: 1px;
    }
    .tt-day-content {
        display: flex;
        background: linear-gradient(360deg, #1a1e2c 50%, transparent 0);
        background-size: 16.7% 16.7%;
    }
</style>
