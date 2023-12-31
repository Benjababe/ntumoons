<script lang="ts">
    import { hideSaturday } from '$lib/stores';
    import type { Lesson } from '$lib/types/Firebase';
    import { onMount } from 'svelte';
    import HiddenLessons from './HiddenLessons.svelte';
    import TimetableColumn from './TimetableColumn.svelte';
    import TimetableRow from './TimetableRow.svelte';
    import type { Day } from '$lib/types/Timetable';
    import { DAYS_FULL, DAYS_SHORT } from '$lib/util';

    export let lessons: Lesson[];
    export let orientation: 'landscape' | 'portrait' = 'landscape';
    export let showIndex: boolean = false;

    const days: Day[] = $hideSaturday ? DAYS_SHORT : DAYS_FULL;
    let times = ['0830'];
    let dayLessons: Partial<Record<Day, Lesson[]>> = {};
    let hiddenLessons: Lesson[] = [];

    onMount(() => {
        while (times[times.length - 1] != '1930') {
            const newTime = parseInt(times[times.length - 1]) + 100;
            const newTimeStr = (newTime < 1000 ? '0' : '') + newTime.toString();
            times = [...times, newTimeStr];
        }
    });

    $: {
        dayLessons = {};
        hiddenLessons = [];

        for (const day of days) dayLessons[day] = [];
        for (const lesson of lessons) {
            if (lesson.day === '' || (lesson.day === 'SAT' && $hideSaturday)) {
                hiddenLessons = [...hiddenLessons, lesson];
                continue;
            }

            const lessonArr = [...(dayLessons[lesson.day] ?? []), lesson];
            dayLessons[lesson.day] = lessonArr;
        }
    }
</script>

{#if orientation == 'landscape'}
    <div>
        <div class="flex justify-between ml-14">
            {#each times as time}
                <span class="-translate-x-1/2">{time}</span>
            {/each}
            <span></span>
        </div>
        <ol class="border border-b-1 border-solid border-neutral rounded-lg border-opacity-50">
            {#each days as day}
                <TimetableRow
                    lessons={dayLessons[day] ?? []}
                    {day}
                    startTime={parseInt(times[0])}
                    {showIndex}
                />
            {/each}
        </ol>
    </div>
    <div class="mt-4">
        <HiddenLessons {hiddenLessons} />
    </div>
{:else}
    <HiddenLessons {hiddenLessons} />
    <div class="flex mb-4">
        <div class="flex flex-col justify-between mr-4 mt-14">
            {#each times as time}
                <span class="-translate-y-1/2">{time}</span>
            {/each}
            <span></span>
        </div>
        <ol
            style:height="1280px"
            class="flex border border-b-1 border-solid border-neutral rounded-lg border-opacity-50"
        >
            {#each days as day, i}
                <TimetableColumn
                    lessons={dayLessons[day] ?? []}
                    {day}
                    startTime={parseInt(times[0])}
                    lastColumn={i === days.length - 1}
                    {showIndex}
                />
            {/each}
        </ol>
    </div>
{/if}
