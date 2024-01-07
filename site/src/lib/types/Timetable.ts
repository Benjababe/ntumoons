/** Types used in the timetable */

import type { Module } from './Firebase';

export type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | '';
export type TimeRange = {
    code?: string;
    start: number;
    end: number;
};

export type DayTimeRangesStr = Partial<Record<Day, string[]>>;
export type DayTimeRanges = Partial<Record<Day, TimeRange[]>>;

export type GenerateRequestParams = {
    modules: Module[];
    dayFiltersStr: DayTimeRangesStr;
};

export type GeneratePlanLimits = {
    planLimit: boolean;
    iterLimit: boolean;
};
