<script lang="ts">
    import { timetableModules } from '$lib/stores';
    import TimetableCell from './TimetableCell.svelte';

    export let day: string;
    export let startTime: number = 830;

    type RowCellDetails = {
        left: number;
        width: number;
        lesson: Lesson;
        accLeft?: number;
    };

    // Percentage of width for every hour
    let widthIntervalPercent = 8.33;
    let details: RowCellDetails[] = [];

    $: {
        details = $timetableModules
            .filter((mod) => mod.active_index_number !== '-1')
            .reduce(
                (acc, mod) => {
                    const indexNum = parseInt(mod.active_index_number);
                    const modLessons = mod.index_numbers[indexNum];
                    const rowLessons = modLessons.filter((l) => l.day === day);

                    details = rowLessons.map((lesson) => {
                        const times = lesson.time.split('-');
                        const lStart = times[0];
                        const lEnd = times[1];

                        const left = getLessonLeftOffset(lStart);
                        const width = getLessonWidth(lStart, lEnd);
                        return { left, width, lesson };
                    });

                    acc = [...acc, ...details];
                    return acc;
                },
                <RowCellDetails[]>[]
            )
            .toSorted((a, b) => a.left - b.left)
            .reduce(
                (acc, { left, width, lesson }, i) => {
                    if (i == 0) return [{ left, width, lesson, accLeft: left + width }];
                    const newLeft = left - (acc[i - 1].accLeft ?? 0);
                    acc = [...acc, { left: newLeft, width, lesson, accLeft: left + width }];
                    return acc;
                },
                <RowCellDetails[]>[]
            );
    }

    function getLessonLeftOffset(lessonStart: string) {
        const hours = (parseInt(lessonStart) - startTime) / 100;
        return hours * widthIntervalPercent;
    }

    function getLessonWidth(lessonStart: string, lessonEnd: string) {
        const hours = (parseInt(lessonEnd) - parseInt(lessonStart)) / 100;
        return hours * widthIntervalPercent;
    }
</script>

<li class="tt-row border-neutral">
    <div class="tt-row-day border-neutral">
        {day}
    </div>
    <div class="tt-row-content">
        {#each details as cellDetails}
            <TimetableCell
                left={cellDetails.left}
                width={cellDetails.width}
                lesson={cellDetails.lesson}
            />
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
        display: flex;
        flex: 1 1 auto;
        flex-direction: row;
        min-height: 100%;
        background: linear-gradient(90deg, #1a1e2c 50%, transparent 0);
        background-size: 16.7% 16.7%;
    }
</style>
