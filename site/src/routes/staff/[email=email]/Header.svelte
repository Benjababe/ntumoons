<script lang="ts">
    import type { Staff } from '$lib/types/Firebase';
    import { t } from '$lib/translations';
    import StaffFallbackImage from '$lib/assets/images/StaffFallbackImage.svelte';

    export let staff: Staff;
</script>

{#if staff.profile_pic_url}
    <img
        class="object-cover object-center w-1/3 aspect-staff-photo rounded-xl"
        src={staff.profile_pic_url}
        alt={staff.title}
    />
{:else}
    <div class="object-cover object-center w-1/3 h-full rounded-xl">
        <StaffFallbackImage class="fill-neutral" />
    </div>
{/if}

<div class="w-2/3 pr-4 overflow-y-scroll">
    <p class="mb-2 text-lg font-bold underline">{$t('Staff.Details.Biography')}</p>
    <p>{staff.biography}</p>
</div>
