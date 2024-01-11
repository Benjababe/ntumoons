<script lang="ts">
    import Error from '$lib/assets/images/Error.svelte';
    import { timetableClashes } from '$lib/stores/timetable';
    import { t } from '$lib/translations';

    let hasClash: boolean;
    $: hasClash = Object.values($timetableClashes).some((arr) => arr.length > 0);
</script>

{#if hasClash}
    <div class="flex justify-center {$$props.class}">
        <div class="w-2/3 rounded-md collapse collapse-arrow bg-error text-error-content">
            <input type="checkbox" />
            <div class="flex items-center justify-center gap-2 font-semibold collapse-title">
                <Error />
                {$t(
                    'Components.Timetable.Timetable.There are clashes between lessons in the timetable!'
                )}
            </div>
            <div class="flex flex-col justify-center mx-auto font-semibold collapse-content">
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
