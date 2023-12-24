<script lang="ts">
    import TimetableCell from './TimetableCell.svelte';
    import {
        calculateCellOffsets,
        getDayCells,
        getIntervals,
        intervalsToGroups,
        type DayCellDetails,
        type DayDetails
    } from './day-helper';

    export let lessons: Lesson[];
    export let day: string;
    export let startTime: number = 830;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let groups: DayCellDetails[][] = [];
    const dayDetails: DayDetails = { day, startTime, widthIntervalPercent };

    $: {
        const cells = getDayCells(lessons, dayDetails);
        const intervals = getIntervals(cells);
        groups = intervalsToGroups(intervals);
        groups = calculateCellOffsets(groups);
    }
</script>

<li class="tt-day border-neutral">
    <div class="tt-day-header border-neutral">
        {day}
    </div>
    <div class="relative w-full tt-day-content">
        {#each groups as group}
            <div class="flex py-1">
                {#each group as cellDetails}
                    <TimetableCell
                        left={cellDetails.left}
                        width={cellDetails.width}
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
        position: relative;
        min-height: 3.5rem;
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
        width: 3.5rem;
        font-weight: 600;
        border-style: solid;
        border-right-width: 1px;
    }

    .tt-day-content {
        background: linear-gradient(90deg, #1a1e2c 50%, transparent 0);
        background-size: 16.7% 16.7%;
    }
</style>
