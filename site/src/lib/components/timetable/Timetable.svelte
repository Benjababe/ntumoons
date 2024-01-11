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
        <div class="flex justify-between time-row ml-14">
            {#each times as time}
                <span class="-translate-x-1/2">{time}</span>
            {/each}
            <span></span>
        </div>
        <ol class="border border-opacity-50 border-solid rounded-lg border-b-1 border-neutral">
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
    {#if hiddenLessons.length > 0}
        <div class="mt-4">
            <HiddenLessons {hiddenLessons} />
        </div>
    {/if}
{:else}
    {#if hiddenLessons.length > 0}
        <div class="mb-4">
            <HiddenLessons {hiddenLessons} />
        </div>
    {/if}
    <div class="flex">
        <div class="flex flex-col justify-between mr-4 mt-14">
            {#each times as time}
                <span class="-translate-y-1/2">{time}</span>
            {/each}
            <span></span>
        </div>
        <ol
            style:height="1280px"
            class="flex border border-opacity-50 border-solid rounded-lg border-b-1 border-neutral"
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
