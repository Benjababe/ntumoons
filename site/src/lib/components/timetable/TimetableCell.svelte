<script lang="ts">
    export let left: string | number;
    export let width: string | number;
    export let lesson: Lesson;
</script>

<button
    class="tt-cell"
    style="margin-left: calc({left}%); width: calc({width}%);"
>
    <div>
        <div>{lesson.module_code} {lesson.type}</div>
        <div>{lesson.venue_name}</div>
        <div>{lesson.time}</div>
        <div>{lesson.remark}</div>
    </div>
</button>

<style>
    .tt-cell {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.375rem;
        font-size: 0.75rem;
        background-color: white;
        height: 95%;
        border-radius: 0.5rem;
    }
</style>
