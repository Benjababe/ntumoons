<script lang="ts">
    import sanitizeHtml from 'sanitize-html';
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    export let staff: Staff;
</script>

{#if staff.research_interests && staff.research_interests.length > 0}
    <div class="collapse collapse-arrow w-full rounded-lg">
        <input type="checkbox" />
        <div
            class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
        >
            <span>{$t('Staff.Details.Research Interests')}</span>
        </div>
        <div class="collapse-content w-full mx-auto bg-base-200 pt-4">
            {#each staff.research_interests as interest}
                <div>{@html sanitizeHtml(interest)}</div>
            {/each}
        </div>
    </div>
{/if}

{#if staff.current_grants && staff.current_grants.length > 0}
    <div class="collapse collapse-arrow w-full rounded-lg first:mt-0 mt-8">
        <input type="checkbox" />
        <div
            class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
        >
            <span>{$t('Staff.Details.Current Grants')}</span>
        </div>
        <div class="collapse-content w-full mx-auto bg-base-200 pt-4 px-8">
            <ol class="list-disc">
                {#each staff.current_grants as grant}
                    <li>{grant}</li>
                {/each}
            </ol>
        </div>
    </div>
{/if}
