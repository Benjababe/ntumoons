import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

const key = 'timetableModules';

export const timetableModules: Writable<Module[]> = writable(
    localStorage[key] ? JSON.parse(localStorage[key]) : []
);

if (browser) {
    timetableModules.subscribe((modules) => (localStorage[key] = JSON.stringify(modules)));
}
