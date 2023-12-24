<script lang="ts">
    export let left: string | number | undefined = undefined;
    export let width: string | number | undefined = undefined;
    export let top: string | number | undefined = undefined;
    export let height: string | number | undefined = undefined;
    export let lesson: Lesson;
    export let overlap: boolean;
    export let squeeze: boolean;

    const overlapStyle = overlap ? 'border: 3px solid red;' : '';
    const landscapeStyle =
        left !== undefined && width !== undefined
            ? `margin-left: calc(${left}%); width: calc(${width}%);`
            : '';
    const portraitStyle =
        top !== undefined && height !== undefined
            ? `position: absolute; top: calc(${top}% + 4px); height: calc(${height}%); width: 95%`
            : '';
</script>

<div
    class="tt-cell"
    style="{landscapeStyle} {portraitStyle} {overlapStyle}"
>
    <div class="text-center">
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
