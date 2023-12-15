<script lang="ts">
    import { t, locale, locales } from '$lib/translations';

    const localeDisplay: { [key: string]: string } = {
        en: '🇬🇧 English',
        'en-SG': '🇸🇬 Singlish'
    };

    function setLocale() {
        localStorage.setItem('locale', $locale);
    }
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.Set Locale')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Switch between languages on a fly')}
        </div>
        <div class="flex flex-row gap-2 items-center justify-center w-48">
            <select
                class="select select-bordered"
                bind:value={$locale}
                on:change={setLocale}
            >
                {#each $locales as value}
                    <option {value}>{localeDisplay[value]}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
