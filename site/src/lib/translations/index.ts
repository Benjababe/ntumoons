import i18n from 'sveltekit-i18n';
import lang from './lang.json';

export const config: import('sveltekit-i18n').Config = {
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
