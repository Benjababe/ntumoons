import { loadTranslations } from '$lib/translations';

export const load = async () => {
    const initialLocale = 'en';
    await loadTranslations(initialLocale);
    return {};
};
