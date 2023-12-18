import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

const key = 'timetableModules';

const initialModules = browser ? JSON.parse(localStorage[key] ?? '[]') : [];

export const timetableModules: Writable<Module[]> = writable(initialModules);

if (browser) {
    timetableModules.subscribe((modules) => (localStorage[key] = JSON.stringify(modules)));
}
