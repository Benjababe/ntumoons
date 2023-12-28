import type { Lesson } from '$lib/types/Firebase';
import { generateRandomString } from '$lib/util';

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
    overlap: boolean;
    squeeze: boolean;
    accLeft?: number;
};

export type ColCellDetails = {
    id: string;
    top: number;
    height: number;
    lesson: Lesson;
    overlap: boolean;
    squeeze: boolean;
    accTop?: number;
};

/**
 * Iterates through all lessons for the day in the timetable and does basic calculations
 * for the width and left offsets for displaying the cells.
 * @param dayLessons All lessons added to the timetable.
 * @param dayDetails Information of the timetable day.
 * @returns Details of all timetable cells including dimensions and offsets.
 */
export function getRowCells(dayLessons: Lesson[], dayDetails: DayDetails): RowCellDetails[] {
    const cells = dayLessons.map((lesson) => {
        const lStart = lesson.start_time;
        const lEnd = lesson.end_time;

        const left = getLessonOffset(lStart, dayDetails);
        const width = getLessonSize(lStart, lEnd, dayDetails);

        // id is used as the cell component's key in svelte
        const id = generateRandomString(12) + left;

        return { id, left, width, lesson, overlap: false, squeeze: false };
    });

    cells.sort((a, b) => a.lesson.start_time - b.lesson.start_time);
    return cells;
}

/**
 * Iterates through all lessons for the day in the timetable and does basic calculations
 * for the length and top offsets for displaying the cells.
 * @param dayLessons All lessons added to the timetable.
 * @param dayDetails Information of the timetable day.
 * @returns Details of all timetable cells including dimensions and offsets.
 */
export function getColumnCells(dayLessons: Lesson[], dayDetails: DayDetails): ColCellDetails[] {
    const cells = dayLessons.map((lesson) => {
        const lStart = lesson.start_time;
        const lEnd = lesson.end_time;

        const top = getLessonOffset(lStart, dayDetails);
        const height = getLessonSize(lStart, lEnd, dayDetails);

        // id is used as the cell component's key in svelte
        const id = generateRandomString(12) + top;

        return { id, top, height, lesson, overlap: false, squeeze: false };
    });

    cells.sort((a, b) => a.lesson.start_time - b.lesson.start_time);
    return cells;
}

/**
 * Calculates the far left/top offset from the timetable the cell should be placed.
 * @param lessonStart Start time of the lesson.
 * @param dayDetails Information of the timetable day.
 * @returns Absolute left offset required for the cell.
 */
export function getLessonOffset(lessonStart: number, dayDetails: DayDetails) {
    const hours = (lessonStart - dayDetails.startTime) / 100;
    return hours * dayDetails.hourIntervalPercent;
}

/**
 * Calculates how wide/tall the cell should be with respect to the lesson's duration.
 * @param lessonStart Start time of the lesson.
 * @param lessonEnd End time of the lesson.
 * @param dayDetails Information of the timetable day.
 * @returns Width required for the cell.
 */
export function getLessonSize(lessonStart: number, lessonEnd: number, dayDetails: DayDetails) {
    const hours = (lessonEnd - lessonStart) / 100;
    return hours * dayDetails.hourIntervalPercent;
}

/**
 * Iterates through all cells and finds any group of lessons that occur in the same time interval.
 * @param cells All cells for the timetable day.
 * @returns All intervals of time in the timetable without gaps.
 */
export function getIntervals<T extends RowCellDetails | ColCellDetails>(cells: T[]) {
    let groupsNeeded = 0;
    let intervals: T[][] = [];
    let curInterval: T[] = [];
    let curIntervalRng = [Number.MAX_SAFE_INTEGER, 0];

    for (const cell of cells) {
        const { start_time, end_time } = cell.lesson;
        if (
            curInterval.length == 0 ||
            (curIntervalRng[0] <= start_time && curIntervalRng[1] >= start_time) ||
            (curIntervalRng[0] <= start_time && curIntervalRng[1] >= end_time) ||
            (curIntervalRng[0] >= start_time && curIntervalRng[1] <= end_time) ||
            (curIntervalRng[0] >= start_time && curIntervalRng[1] >= end_time)
        ) {
            curInterval = [...curInterval, cell];
            curIntervalRng[0] = Math.min(curIntervalRng[0], start_time);
            curIntervalRng[1] = Math.max(curIntervalRng[1], end_time);
        } else {
            if (curInterval.length > groupsNeeded) groupsNeeded = curInterval.length;
            curInterval = getLessonsClash(curInterval);
            intervals = [...intervals, curInterval];
            curInterval = [cell];
            curIntervalRng = [start_time, end_time];
        }
    }
    if (curInterval.length > groupsNeeded) groupsNeeded = curInterval.length;
    curInterval = getLessonsClash(curInterval);
    intervals = [...intervals, curInterval];
    return intervals;
}

/**
 * Checks time interval for lessons that may overlap one another, flags them accordingly.
 * Only considered clashing if their module codes are different.
 * Eg. CZ3004 has clashing lessons but they are all under 1 module.
 * @param interval An interval of time without any gaps between lessons.
 * @returns Interval updated with overlap information.
 */
export function getLessonsClash<T extends RowCellDetails | ColCellDetails>(interval: T[]) {
    const uniqueCodes = new Set();
    for (const lesson of interval) {
        uniqueCodes.add(lesson.lesson.module_code);
    }
    for (let i = 0; i < interval.length; i++) {
        interval[i].overlap = uniqueCodes.size > 1;
        interval[i].squeeze = interval.length > 2;
        interval[i].id += interval[i].overlap ? 'o' : 'n';
    }
    return interval;
}

/**
 * Converts the intervals to organised groups to be displayed.
 * @param intervals All intervals of time without gaps between lessons.
 * @returns Groups properly organised and to be displayed.
 */
export function intervalsToGroups<T extends RowCellDetails | ColCellDetails>(intervals: T[][]) {
    let groups: T[][] = [];

    for (const interval of intervals) {
        for (let i = 0; i < interval.length; i++) {
            const cell = interval[i];

            // if groups is empty, add cell
            if (groups.length == 0) {
                groups[0] = [cell];
                continue;
            }

            // else, check for earliest group that supports the cell
            // by checking the end time of the last cell in a group.
            // it's fine as intervals is already sorted.

            let stored = false;
            for (let j = 0; j < groups.length; j++) {
                const group = groups[j];
                if (group[group.length - 1].lesson.end_time < cell.lesson.start_time) {
                    stored = true;
                    groups[j] = [...groups[j], cell];
                    break;
                }
            }

            // if no group supports the cell, create a new group
            if (!stored) groups = [...groups, [cell]];
        }
    }

    return groups;
}

/**
 * Recalculate the cell's offsets to ensure proper fitting in the timetable.
 * @param groups All groups organised to be displayed.
 * @returns Groups with the cells properly offset.
 */
export function calculateCellLeftOffsets(groups: RowCellDetails[][]) {
    groups = groups.map((row) => {
        return row.reduce(
            (acc, cell, i) => {
                if (i === 0) {
                    cell.accLeft = cell.left + cell.width;
                } else {
                    const newLeft = cell.left - (acc[i - 1].accLeft ?? 0);
                    cell.left = newLeft;
                    cell.accLeft = (acc[i - 1].accLeft ?? 0) + cell.left + cell.width;
                }
                return [...acc, cell];
            },
            <RowCellDetails[]>[]
        );
    });
    return groups;
}

/**
 * Recalculate the cell's offsets to ensure proper fitting in the timetable.
 * @param groups All groups organised to be displayed.
 * @returns Groups with the cells properly offset.
 */
export function calculateCellTopOffsets(groups: ColCellDetails[][]) {
    groups = groups.map((group) => {
        return group.reduce(
            (acc, cell) => {
                cell.accTop = cell.top + cell.height;
                return [...acc, cell];
            },
            <ColCellDetails[]>[]
        );
    });
    return groups;
}
