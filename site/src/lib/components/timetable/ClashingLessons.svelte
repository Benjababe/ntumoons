<script lang="ts">
    import Error from '$lib/assets/images/Error.svelte';
    import { timetableClashes } from '$lib/stores/timetable';
    import { t } from '$lib/translations';

    let hasClash: boolean;
    $: hasClash = Object.values($timetableClashes).some((arr) => arr.length > 0);
</script>

{#if hasClash}
    <div class="flex justify-center {$$props.class}">
        <div class="collapse collapse-arrow w-2/3 bg-error text-error-content rounded-md">
            <input type="checkbox" />
            <div class="collapse-title flex justify-center items-center gap-2 font-semibold">
                <Error />
                {$t(
                    'Components.Timetable.Timetable.There are clashes between lessons in the timetable!'
                )}
            </div>
            <div class="collapse-content flex flex-col mx-auto justify-center font-semibold">
                <ul>
                    {#each Object.entries($timetableClashes) as [day, intervals]}
                        {#if intervals.length > 0}
                            {day}:
                            {#each intervals as interval}
                                ({interval.join(',')})
                            {/each}
                        {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{/if}
