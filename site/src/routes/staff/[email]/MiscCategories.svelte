<script lang="ts">
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    export let staff: Staff;
</script>

{#if staff.research_interests.length > 0}
    <div class="collapse collapse-arrow w-full rounded-lg">
        <input
            type="radio"
            name="accordion"
            checked={true}
        />
        <div
            class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
        >
            <span>{$t('Staff.Details.Research Interests')}</span>
        </div>
        <div class="collapse-content w-full mx-auto bg-base-200 pt-4">
            {#each staff.research_interests as interest}
                <div>{@html interest}</div>
            {/each}
        </div>
    </div>
{/if}

{#if staff.current_grants.length > 0}
    <div class="collapse collapse-arrow w-full rounded-lg">
        <input
            type="radio"
            name="accordion"
            checked={true}
        />
        <div
            class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
        >
            <span>{$t('Staff.Details.Current Grants')}</span>
        </div>
        <ul class="collapse-content list-disc w-full mx-auto bg-base-200 pt-4 pl-8">
            {#each staff.current_grants as grant}
                <li>{@html grant}</li>
            {/each}
        </ul>
    </div>
{/if}
