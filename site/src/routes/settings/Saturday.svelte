<script lang="ts">
    import { t } from '$lib/translations';
    import { hideSaturday } from '$lib/stores';
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.Saturday.Hide Saturday')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Saturday.Hide Saturdays from timetable')}
        </div>
        <div class="flex flex-row gap-2 items-center justify-center w-48">
            <input
                type="checkbox"
                class="toggle"
                bind:checked={$hideSaturday}
            />
        </div>
    </div>
</div>
