<script lang="ts">
    import { t } from '$lib/translations';
    import type { Staff } from '$lib/types/Firebase';
    import NewTab from '$lib/assets/images/NewTab.svelte';
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
                <a
                    class="flex gap-1 btn btn-sm btn-neutral"
                    target="_blank"
                    href={staff.personal_url}
                >
                    {$t('Staff.Details.Personal Website')}
                    <NewTab />
                </a>
            {/if}
            <a
                class="flex gap-1 btn btn-sm btn-neutral"
                target="_blank"
                href={staff.url}
            >
                {$t('Staff.Details.NTU Website')}
                <NewTab />
            </a>
        </div>
    </div>
</div>
