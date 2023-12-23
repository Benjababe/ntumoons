export type RowDetails = {
    day: string;
    startTime: number;
    widthIntervalPercent: number;
};

export type RowCellDetails = {
    left: number;
    width: number;
    lesson: Lesson;
    overlap: boolean;
    squeeze: boolean;
    accLeft?: number;
};

/**
 * Iterates through all modules for the day in the timetable and does basic calculations
 * for the width and left offsets for displaying the cells.
 * @param timetableModules All modules added to the timetable.
 * @param rowDetails Information of the timetable row.
 * @returns Details of all timetable cells including dimensions and offsets.
 */
export function getRowCells(timetableModules: Module[], rowDetails: RowDetails) {
    const cells = timetableModules
        .filter((mod) => mod.active_index_number !== '-1')
        .reduce(
            (acc, mod) => {
                const indexNum = parseInt(mod.active_index_number);
                const modLessons = mod.index_numbers[indexNum];
                const rowLessons = modLessons.filter((l) => l.day === rowDetails.day);

                const tmpDetails = rowLessons.map((lesson) => {
                    const lStart = lesson.start_time;
                    const lEnd = lesson.end_time;

                    const left = getLessonLeftOffset(lStart, rowDetails);
                    const width = getLessonWidth(lStart, lEnd, rowDetails);
                    return { left, width, lesson, overlap: false, squeeze: false };
                });

                acc = [...acc, ...tmpDetails];
                return acc;
            },
            <RowCellDetails[]>[]
        );

    cells.sort((a, b) => a.lesson.start_time - b.lesson.start_time);
    return cells;
}

/**
 * Calculates of far left from the timetable the cell should be placed.
 * @param lessonStart Start time of the lesson.
 * @param rowDetails Information of the timetable row.
 * @returns Absolute left offset required for the cell.
 */
export function getLessonLeftOffset(lessonStart: number, rowDetails: RowDetails) {
    const hours = (lessonStart - rowDetails.startTime) / 100;
    return hours * rowDetails.widthIntervalPercent;
}

/**
 * Calculates how wide the cell should be with respect to the lesson's duration.
 * @param lessonStart Start time of the lesson.
 * @param lessonEnd End time of the lesson.
 * @param rowDetails Information of the timetable row.
 * @returns Width required for the cell.
 */
export function getLessonWidth(lessonStart: number, lessonEnd: number, rowDetails: RowDetails) {
    const hours = (lessonEnd - lessonStart) / 100;
    return hours * rowDetails.widthIntervalPercent;
}

/**
 * Iterates through all cells and finds any group of lessons that occur in the same time interval.
 * @param cells All cells for the timetable row.
 * @returns All intervals of time in the timetable without gaps.
 */
export function getIntervals(cells: RowCellDetails[]) {
    let rowsNeeded = 0;
    let intervals: RowCellDetails[][] = [];
    let curInterval: RowCellDetails[] = [];
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
            if (curInterval.length > rowsNeeded) rowsNeeded = curInterval.length;
            curInterval = getLessonsClash(curInterval);
            intervals = [...intervals, curInterval];
            curInterval = [cell];
            curIntervalRng = [start_time, end_time];
        }
    }
    if (curInterval.length > rowsNeeded) rowsNeeded = curInterval.length;
    curInterval = getLessonsClash(curInterval);
    intervals = [...intervals, curInterval];
    return intervals;
}

/**
 * Checks time interval for lessons that may overlap one another, flags them accordingly.
 * Only considered clashing if their module codes are different.
 * CZ3004 has clashing lessons but they are all under 1 module.
 * @param interval An interval of time without any gaps between lessons.
 * @returns Interval updated with overlap information.
 */
export function getLessonsClash(interval: RowCellDetails[]) {
    const uniqueCodes = new Set();
    for (const lesson of interval) {
        uniqueCodes.add(lesson.lesson.module_code);
    }
    for (let i = 0; i < interval.length; i++) {
        interval[i].overlap = uniqueCodes.size > 1;
        interval[i].squeeze = interval.length > 2;
    }
    return interval;
}

/**
 * Converts the intervals to organised rows to be displayed.
 * @param intervals All intervals of time without gaps between lessons.
 * @returns Rows properly organised and to be displayed.
 */
export function intervalsToRows(intervals: RowCellDetails[][]) {
    const rows: RowCellDetails[][] = [];

    for (const interval of intervals) {
        for (let i = 0; i < interval.length; i++) {
            if (rows.length - 1 < i) rows[i] = [interval[i]];
            else rows[i] = [...rows[i], interval[i]];
        }
    }

    return rows;
}

/**
 * Recalculate the cell's offsets to ensure proper fitting in the timetable.
 * @param rows All rows organised to be displayed.
 * @returns Rows with the cells properly offset.
 */
export function calculateCellOffsets(rows: RowCellDetails[][]) {
    rows = rows.map((row) => {
        return row.reduce(
            (acc, { left, width, lesson, overlap, squeeze }, i) => {
                if (i == 0)
                    return [{ left, width, lesson, accLeft: left + width, overlap, squeeze }];
                const newLeft = left - (acc[i - 1].accLeft ?? 0);
                acc = [
                    ...acc,
                    { left: newLeft, width, lesson, accLeft: left + width, overlap, squeeze }
                ];
                return acc;
            },
            <RowCellDetails[]>[]
        );
    });
    return rows;
}
