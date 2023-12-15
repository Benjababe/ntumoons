<script lang="ts">
    import { t } from '$lib/translations';
    import moonIcon from '$lib/assets/moon.svg?raw';
    import sunIcon from '$lib/assets/sun.svg?raw';

    import { onMount } from 'svelte';

    let isLight = false;

    onMount(() => {
        const theme = localStorage.getItem('theme') ?? 'dark';
        isLight = theme === 'light';
    });

    function toggleTheme() {
        const theme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.Toggle Theme')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Toggle between dark and light themes')}
        </div>
        <div class="flex flex-row gap-2 items-center justify-center w-48">
            {@html moonIcon}
            <input
                type="checkbox"
                value="light"
                class="toggle theme-controller"
                bind:checked={isLight}
                on:change={toggleTheme}
            />
            {@html sunIcon}
        </div>
    </div>
</div>
