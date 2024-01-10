/** Types used in the timetable */

import type { Lesson, Module } from './Firebase';

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

export type DayDetails = {
    day: string;
    startTime: number;
    hourIntervalPercent: number;
};

export type RowCellDetails = {
    id: string;
    left: number;
    width: number;
    lesson: Lesson;
    clashing: boolean;
    squeeze: boolean;
    accLeft?: number;
};

export type ColCellDetails = {
    id: string;
    top: number;
    height: number;
    lesson: Lesson;
    clashing: boolean;
    squeeze: boolean;
    accTop?: number;
};
