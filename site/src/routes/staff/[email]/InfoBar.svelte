<script lang="ts">
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    import NewTabLink from '$lib/components/generic/NewTabLink.svelte';
    export let staff: Staff;
</script>

<div class="collapse collapse-arrow w-full rounded-lg">
    <input type="checkbox" />
    <div
        class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
    >
        <span>{staff.title}</span>
    </div>
    <div class="collapse-content w-full mx-auto bg-base-200 pt-4">
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
