import type { Semester } from '$lib/types/Firebase';
import { persisted } from 'svelte-persisted-store';

const key = 'activeSemester';
export const defaultSemester = {
    default: true,
    title: 'AY 2023/24 Semester 2',
    active: false,
    id: '2023;2',
    year: '2023',
    semester_num: '2'
};
export const activeSemester = persisted<Semester>(key, defaultSemester);
