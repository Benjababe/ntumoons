import { persisted } from 'svelte-persisted-store';

const key = 'timetableModules';
export const timetableModules = persisted<Module[]>(key, []);
