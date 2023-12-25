<script lang="ts">
    import { t } from '$lib/translations';
    import Themes from './Themes.svelte';
    import Locale from './Locale.svelte';
    import Saturday from './Saturday.svelte';
</script>

<div class="flex justify-center">
    <div class="w-full max-w-4xl flex flex-col justify-center">
        <h1 class="text-3xl font-bold">
            {$t('Settings.Settings')}
        </h1>
        <div class="divider" />
        <Saturday />
        <div class="divider" />
        <Themes />
        <div class="divider" />
        <Locale />
        <div class="divider" />
    </div>
</div>
