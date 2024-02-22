<script lang="ts">
    import type { Lesson } from '$lib/types/Firebase';

    export let left: string | number | undefined = undefined;
    export let width: string | number | undefined = undefined;
    export let top: string | number | undefined = undefined;
    export let height: string | number | undefined = undefined;
    export let lesson: Lesson;
    export let clashing: boolean;
    export let showIndex: boolean = false;

    // Use margin-left for rows because row heights will not wrap cells if cells are absolute.
    const landscapeStyle =
        left !== undefined && width !== undefined
            ? `margin-left: calc(${left}% + 4px); width: calc(${width}% - 4px);`
            : '';

    // Use absolute positioning for columns as margins won't work properly here.
    // Very important to ensure each column's initial width can fit the full cell.
    const portraitStyle =
        top !== undefined && height !== undefined
            ? `position: relative; top: calc(${top}% + 4px); height: calc(${height}% - 4px); width: 95%`
            : '';

    const clashClass = clashing ? 'border-3 border-solid border-error' : 'border border-neutral';
</script>

<div
    class="flex flex-col justify-center items-center p-1.5 text-xs bg-white rounded-lg {clashClass}"
    style="{landscapeStyle} {portraitStyle}"
>
    <div class="text-center text-gray-700">
        {#if showIndex}<div>{lesson.index}</div>{/if}
        <div>{lesson.module_code} {lesson.type}</div>
        <div>{lesson.venue_name}</div>
        <div>{lesson.time}</div>
        <div>{lesson.remark}</div>
    </div>
</div>
