import { type Writable, writable } from 'svelte/store';

const defaultSemester = { title: 'AY 2023/24 Semester 2', active: true, id: '2023;2' };
export const semester: Writable<Semester> = writable(defaultSemester);
export const timetableModules: Writable<Module[]> = writable([]);
