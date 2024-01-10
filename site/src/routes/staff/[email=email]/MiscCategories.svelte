<script lang="ts">
    import sanitizeHtml from 'sanitize-html';
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    export let staff: Staff;
</script>

{#if staff.research_interests && staff.research_interests.length > 0}
    <div class="w-full rounded-lg collapse collapse-arrow">
        <input type="checkbox" />
        <div
            class="flex items-center justify-around h-12 text-xl font-semibold collapse-title bg-base-300"
        >
            <span>{$t('Staff.Details.Research Interests')}</span>
        </div>
        <div class="w-full pt-4 mx-auto collapse-content bg-base-200">
            {#each staff.research_interests as interest}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                <div>{@html sanitizeHtml(interest)}</div>
            {/each}
        </div>
    </div>
{/if}

{#if staff.current_grants && staff.current_grants.length > 0}
    <div class="w-full mt-8 rounded-lg collapse collapse-arrow first:mt-0">
        <input type="checkbox" />
        <div
            class="flex items-center justify-around h-12 text-xl font-semibold collapse-title bg-base-300"
        >
            <span>{$t('Staff.Details.Current Grants')}</span>
        </div>
        <div class="w-full px-8 pt-4 mx-auto collapse-content bg-base-200">
            <ol class="list-disc">
                {#each staff.current_grants as grant}
                    <li>{grant}</li>
                {/each}
            </ol>
        </div>
    </div>
{/if}
