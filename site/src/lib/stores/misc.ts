import { persisted } from 'svelte-persisted-store';

const key = 'hideSaturday';
export const hideSaturday = persisted<boolean>(key, false);
