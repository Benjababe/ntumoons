<script lang="ts">
    export let left: string | number;
    export let width: string | number;
    export let lesson: Lesson;
    export let overlap: boolean;
    export let squeeze: boolean;

    const overlapStyle = overlap ? 'border: 3px solid red;' : '';
</script>

<div
    class="tt-cell"
    style="margin-left: calc({left}%); width: calc({width}%); {overlapStyle}"
>
    <div>
        <div>{lesson.module_code} {lesson.type}</div>
        <div>{lesson.venue_name}</div>
        <div>{lesson.time}</div>
        <div>{lesson.remark}</div>
    </div>
</div>

<style>
    .tt-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.375rem;
        font-size: 0.75rem;
        background-color: white;
        border-radius: 0.5rem;
    }
</style>
