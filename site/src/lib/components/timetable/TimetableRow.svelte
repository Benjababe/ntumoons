<script lang="ts">
    import { timetableModules } from '$lib/stores';
    import TimetableCell from './TimetableCell.svelte';
    import {
        calculateCellOffsets,
        getRowCells,
        getIntervals,
        intervalsToRows,
        type RowCellDetails,
        type RowDetails
    } from './row-helper';

    export let day: string;
    export let startTime: number = 830;

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let rows: RowCellDetails[][] = [];
    const rowDetails: RowDetails = { day, startTime, widthIntervalPercent };

    $: {
        const cells = getRowCells($timetableModules, rowDetails);
        const intervals = getIntervals(cells);
        rows = intervalsToRows(intervals);
        rows = calculateCellOffsets(rows);
    }
</script>

<li class="tt-row border-neutral tt-row-content">
    <div class="tt-row-day border-neutral">
        {day}
    </div>
    <div class="relative h-full w-full">
        {#each rows as row}
            <div class="flex py-1">
                {#each row as cellDetails}
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
    </div>
</li>

<style>
    .tt-row {
        display: flex;
        position: relative;
        min-height: 3.5rem;
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

    .tt-row-content {
        background: linear-gradient(90deg, #1a1e2c 50%, transparent 0);
        background-size: 16.7% 16.7%;
    }
</style>
