<script lang="ts">
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    export let staff: Staff;

    const reservedKeywords = staff.interests;
    const freeKeywords = staff.keywords.filter((kw) => !reservedKeywords.includes(kw));
</script>

<p class="font-bold underline text-lg mb-2">
    {$t('Staff.Details.Keywords')}
</p>
<div class="flex flex-wrap flex-1 gap-x-2 gap-y-1">
    {#each reservedKeywords as keyword}
        <a
            class="btn btn-primary btn-xs text-xs whitespace-nowrap"
            target="_blank"
            href="/staff"
        >
            {keyword}
        </a>
    {/each}
    {#each freeKeywords as keyword}
        <a
            class="btn btn-neutral btn-xs text-xs whitespace-nowrap"
            target="_blank"
            href="/staff"
        >
            {keyword}
        </a>
    {/each}
</div>
