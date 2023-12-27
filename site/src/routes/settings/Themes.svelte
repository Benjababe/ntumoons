<script lang="ts">
    import { t } from '$lib/translations';
    import Moon from '$lib/assets/images/Moon.svelte';
    import Sun from '$lib/assets/images/Sun.svelte';

    import { onMount } from 'svelte';

    let isLight = false;

    onMount(() => {
        const theme = localStorage.theme ?? 'dark';
        isLight = theme === 'light';
    });

    function toggleTheme() {
        const theme = isLight ? 'light' : 'dark';
        localStorage.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
    }
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.Theme.Toggle Theme')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Theme.Toggle between dark and light themes')}
        </div>
        <div class="flex flex-row gap-2 items-center justify-center w-48">
            <Moon />
            <input
                type="checkbox"
                value="light"
                class="toggle theme-controller"
                bind:checked={isLight}
                on:change={toggleTheme}
            />
            <Sun />
        </div>
    </div>
</div>
