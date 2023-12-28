<script lang="ts">
    import { t } from '$lib/translations';
    import Info from '$lib/assets/images/Info.svelte';
    export let hiddenLessons: Lesson[];
</script>

{#if hiddenLessons.length > 0}
    <div class="flex justify-center mb-4">
        <div class="collapse collapse-arrow w-2/3 bg-warning text-warning-content rounded-md">
            <input type="checkbox" />
            <div class="collapse-title flex justify-center items-center gap-2 font-semibold">
                <Info />
                {$t('Components.Timetable.Timetable.Some lessons were hidden from the timetable')}
            </div>
            <div class="collapse-content flex flex-col mx-auto justify-center">
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
