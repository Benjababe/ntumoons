import type { Module } from '$lib/types/Firebase';
import type { Day } from '$lib/types/Timetable';
import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

const key = 'timetableModules';
export const timetableModules = persisted<Record<string, Module[]>>(key, {});

type TimetableClashes = Partial<Record<Day, string[][]>>;
const defaultDayClashes: TimetableClashes = {};
export const timetableClashes = writable(defaultDayClashes);
