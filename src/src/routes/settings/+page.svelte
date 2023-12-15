<script lang="ts">
    import { t } from '$lib/translations';
    import Theme from './theme.svelte';
    import Locale from './locale.svelte';
</script>

<div class="flex justify-center">
    <div class="w-full max-w-4xl flex flex-col justify-center">
        <h1 class="text-3xl font-bold">
            {$t('Settings.Settings')}
        </h1>
        <div class="divider" />
        <Theme />
        <div class="divider" />
        <Locale />
        <div class="divider" />
    </div>
</div>
