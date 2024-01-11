<script lang="ts">
    import { t } from '$lib/translations';
    import { hideSaturday } from '$lib/stores';
</script>

<div>
    <h3 class="mb-4 text-xl font-semibold">
        {$t('Settings.Saturday.Hide Saturday')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Saturday.Hide Saturdays from timetable')}
        </div>
        <div class="flex flex-row items-center justify-center w-48 gap-2">
            <input
                type="checkbox"
                class="toggle"
                bind:checked={$hideSaturday}
            />
        </div>
    </div>
</div>
