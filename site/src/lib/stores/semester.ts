import { persisted } from 'svelte-persisted-store';

const key = 'semester';
export const defaultSemester = { title: 'AY 2023/24 Semester 2', active: false, id: '2023;2' };
export const semester = persisted<Semester>(key, defaultSemester);
