<script lang="ts">
    import { t } from '$lib/translations';
    import Themes from './Themes.svelte';
    import Locales from './Locales.svelte';
    import Saturday from './Saturday.svelte';
    import ClearStorage from './ClearStorage.svelte';
</script>

<div class="flex justify-center">
    <div class="flex flex-col justify-center w-full max-w-4xl">
        <h1 class="text-3xl font-bold">
            {$t('Settings.Settings')}
        </h1>
        <div class="divider" />
        <Saturday />
        <div class="divider" />
        <Themes />
        <div class="divider" />
        <Locales />
        <div class="divider" />
        <ClearStorage />
        <div class="divider" />
    </div>
</div>
