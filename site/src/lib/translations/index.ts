import i18n from 'sveltekit-i18n';
import type { Config } from 'sveltekit-i18n';
import lang from './lang.json';

type TranslationPayload = {
    found?: number;
    name?: string;
    planLimit?: number;
    iterLimit?: number;
    code?: string;
    semesterTitle?: string;
    planIndex?: number;
    planLen?: number;
};

export const config: Config<TranslationPayload> = {
    fallbackLocale: 'en',
    translations: {
        en: { lang },
        'en-SG': { lang }
    },
    loaders: [
        {
            locale: 'en',
            key: '',
            loader: async () => (await import('./locales/en.json')).default
        },
        {
            locale: 'en-SG',
            key: '',
            loader: async () => (await import('./locales/en-SG.json')).default
        }
    ]
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
