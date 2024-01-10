<script lang="ts">
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    import NewTabLink from '$lib/components/generic/NewTabLink.svelte';
    export let staff: Staff;
</script>

<div class="w-full rounded-lg collapse collapse-arrow">
    <input type="checkbox" />
    <div
        class="flex items-center justify-around h-12 text-xl font-semibold collapse-title bg-base-300"
    >
        <span>{staff.title}</span>
    </div>
    <div class="w-full pt-4 mx-auto collapse-content bg-base-200">
        <div class="flex items-center justify-evenly">
            <a
                class="flex gap-1 btn btn-sm btn-neutral"
                href="mailto:{staff.email}"
            >
                {$t('Staff.Details.Email')}
            </a>
            {#if staff.personal_url}
                <NewTabLink
                    class="btn btn-sm btn-neutral"
                    url={staff.personal_url}
                    text={$t('Staff.Details.Personal Website')}
                />
            {/if}
            <NewTabLink
                class="btn btn-sm btn-neutral"
                url={staff.url}
                text={$t('Staff.Details.NTU Website')}
            />
        </div>
    </div>
</div>
