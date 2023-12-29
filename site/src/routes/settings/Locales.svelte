<script lang="ts">
    import { t, locale, locales } from '$lib/translations';

    let localeDisplay: Partial<Record<string, string>>;

    $: localeDisplay = {
        en: $t('Settings.Locale.Languages.English'),
        'en-SG': $t('Settings.Locale.Languages.Singlish')
    };

    function setLocale() {
        localStorage.locale = $locale;
    }
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.Locale.Set Locale')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.Locale.Switch between languages on a fly')}
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
