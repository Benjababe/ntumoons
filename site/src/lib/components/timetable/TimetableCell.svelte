<script lang="ts">
    import type { Lesson } from '$lib/types/Firebase';

    export let left: string | number | undefined = undefined;
    export let width: string | number | undefined = undefined;
    export let top: string | number | undefined = undefined;
    export let height: string | number | undefined = undefined;
    export let lesson: Lesson;
    export let clashing: boolean;

    const landscapeStyle =
        left !== undefined && width !== undefined
            ? `margin-left: calc(${left}% + 4px); width: calc(${width}% - 4px);`
            : '';
    const portraitStyle =
        top !== undefined && height !== undefined
            ? `position: absolute; top: calc(${top}% + 4px); height: calc(${height}% - 4px); width: 95%`
            : '';
</script>

<div
    class="tt-cell {clashing ? 'border-3 border-solid border-error' : 'border border-neutral'}"
    style="{landscapeStyle} {portraitStyle}"
>
    <div class="text-center text-gray-700">
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
