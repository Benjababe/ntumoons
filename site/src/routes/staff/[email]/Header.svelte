<script lang="ts">
    import type { Staff } from '$lib/types/Firebase';
    import { t } from '$lib/translations';
    import StaffFallbackImage from '$lib/assets/images/StaffFallbackImage.svelte';

    export let staff: Staff;
</script>

{#if staff.profile_pic_url}
    <img
        class="w-1/3 aspect-staff-photo object-cover object-center rounded-xl"
        src={staff.profile_pic_url}
        alt={staff.title}
    />
{:else}
    <div class="h-full w-1/3 object-cover object-center rounded-xl">
        <StaffFallbackImage class="fill-neutral" />
    </div>
{/if}

<div class="w-2/3 pr-4 overflow-y-scroll">
    <p class="font-bold underline text-lg mb-2">{$t('Staff.Details.Biography')}</p>
    <p>{staff.biography}</p>
</div>
