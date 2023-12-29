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
<div class="flex flex-col">
    <div class="flex flex-wrap flex-1 gap-x-2 gap-y-1">
        {#each reservedKeywords as keyword}
            <button>
                <a
                    class="btn btn-primary btn-xs text-xs text-left h-fit w-full py-0.5"
                    target="_blank"
                    href="/staff"
                >
                    {keyword}
                </a>
            </button>
        {/each}
    </div>
    <div class="divider my-1" />
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
