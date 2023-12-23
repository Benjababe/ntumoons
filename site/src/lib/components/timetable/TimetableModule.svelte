<script lang="ts">
    import { onMount } from 'svelte';
    import TimetableRow from './TimetableRow.svelte';

    export let lessons: Lesson[];

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    let times = ['0830'];
    let rowLessons: { [key: string]: Lesson[] } = {};

    onMount(() => {
        while (times[times.length - 1] != '1930') {
            const newTime = parseInt(times[times.length - 1]) + 100;
            const newTimeStr = (newTime < 1000 ? '0' : '') + newTime.toString();
            times = [...times, newTimeStr];
        }
    });

    $: {
        rowLessons = {};
        for (const day of days) rowLessons[day] = [];
        for (const lesson of lessons) {
            const lessonArr = [...rowLessons[lesson.day], lesson];
            rowLessons[lesson.day] = lessonArr;
        }
    }
</script>

<div class="mb-8">
    <div class="flex justify-between ml-14">
        {#each times as time}
            <span class="-translate-x-1/2">{time}</span>
        {/each}
        <span></span>
    </div>
    <ol class="border border-b-1 border-solid border-neutral rounded-lg">
        {#each days as day}
            <TimetableRow
                lessons={rowLessons[day]}
                {day}
                startTime={parseInt(times[0])}
            />
        {/each}
    </ol>
</div>
