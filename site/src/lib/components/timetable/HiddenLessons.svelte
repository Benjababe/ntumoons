<script lang="ts">
    import { t } from '$lib/translations';
    import Info from '$lib/assets/images/Info.svelte';
    import type { Lesson } from '$lib/types/Firebase';
    export let hiddenLessons: Lesson[];
</script>

{#if hiddenLessons.length > 0}
    <div class="flex justify-center">
        <div class="w-2/3 rounded-md collapse collapse-arrow bg-warning text-warning-content">
            <input type="checkbox" />
            <div class="flex items-center justify-center gap-2 font-semibold collapse-title">
                <Info />
                {$t('Components.Timetable.Timetable.Some lessons were hidden from the timetable')}
            </div>
            <div class="flex flex-col justify-center mx-auto collapse-content">
                <ul class="list-disc">
                    {#each hiddenLessons as { module_code, index, day, type, venue_name, start_time, end_time, remark }}
                        <li>
                            <span class="font-bold">{module_code}</span>
                            <span>({index}): </span>
                            <span>
                                {#if day !== ''}{day},{/if}
                                {#if type !== ''}{type},{/if}
                                {#if venue_name !== ''}{venue_name},{/if}
                                {#if start_time !== 0 && end_time !== 0}{start_time}-{end_time}{/if}
                                {#if remark !== ''}({remark}){/if}
                            </span>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{/if}
