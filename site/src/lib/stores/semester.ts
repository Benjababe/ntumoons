import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

const key = 'semester';
const defaultSemester = { title: 'AY 2023/24 Semester 2', active: true, id: '2023;2' };
export const semester: Writable<Semester> = writable(defaultSemester);

if (browser) {
    semester.subscribe((sem) => (localStorage[key] = sem));
}
