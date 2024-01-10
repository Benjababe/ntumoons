<script lang="ts">
    import NewTabLink from '$lib/components/generic/NewTabLink.svelte';
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    export let staff: Staff;

    const reservedKeywords = staff.interests;
    const freeKeywords = staff.keywords.filter((kw) => !reservedKeywords.includes(kw));
</script>

<p class="mb-2 text-lg font-bold underline">
    {$t('Staff.Details.Keywords')}
</p>
<div class="flex flex-col">
    <div class="flex flex-wrap flex-1 gap-x-2 gap-y-1">
        {#each reservedKeywords as keyword}
            <button>
                <NewTabLink
                    class="btn btn-primary text-primary-content btn-xs text-xs text-left h-fit w-full py-0.5"
                    url="/staff?keywords={keyword}"
                    text={keyword}
                />
            </button>
        {/each}
    </div>
    <div class="my-1 divider" />
    <div class="flex flex-wrap flex-1 gap-x-2 gap-y-1">
        {#each freeKeywords as keyword}
            <button>
                <span class="btn btn-neutral btn-xs text-xs text-left h-fit w-full py-0.5">
                    {keyword}
                </span>
            </button>
        {/each}
    </div>
</div>
