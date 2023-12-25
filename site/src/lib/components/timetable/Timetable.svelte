<script lang="ts">
    import { onMount } from 'svelte';
    import TimetableRow from './TimetableRow.svelte';
    import TimetableColumn from './TimetableColumn.svelte';

    export let lessons: Lesson[];
    export let orientation: 'landscape' | 'portrait' = 'landscape';

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    let times = ['0830'];
    let dayLessons: { [key: string]: Lesson[] } = {};

    onMount(() => {
        while (times[times.length - 1] != '1930') {
            const newTime = parseInt(times[times.length - 1]) + 100;
            const newTimeStr = (newTime < 1000 ? '0' : '') + newTime.toString();
            times = [...times, newTimeStr];
        }
    });

    $: {
        dayLessons = {};
        for (const day of days) dayLessons[day] = [];
        for (const lesson of lessons) {
            if (lesson.day === '') continue;
            const lessonArr = [...dayLessons[lesson.day], lesson];
            dayLessons[lesson.day] = lessonArr;
        }
    }
</script>

{#if orientation == 'landscape'}
    <div class="mb-8">
        <div class="flex justify-between ml-14">
            {#each times as time}
                <span class="-translate-x-1/2">{time}</span>
            {/each}
            <span></span>
        </div>
        <ol class="border border-b-1 border-solid border-neutral rounded-lg border-opacity-50">
            {#each days as day}
                <TimetableRow
                    lessons={dayLessons[day]}
                    {day}
                    startTime={parseInt(times[0])}
                />
            {/each}
        </ol>
    </div>
{:else}
    <div class="flex mb-8">
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
            {#each days as day}
                <TimetableColumn
                    lessons={dayLessons[day]}
                    {day}
                    startTime={parseInt(times[0])}
                />
            {/each}
        </ol>
    </div>
{/if}
