import { dayTimeRangesStrToTime } from '$lib/components/timetable/day-helper';
import type { Lesson, Module } from '$lib/types/Firebase';
import type { DayTimeRanges, DayTimeRangesStr, TimeRange } from '$lib/types/Timetable';
import { DAYS_FULL } from '$lib/util';

export const PLAN_LIMIT = 10000;
export const ITER_LIMIT = 50000;

let plans: Lesson[][] = [];
let iters = 0;

type TimetableResponse = {
    generatedPlans: Lesson[][];
    planLimit: boolean;
    iterLimit: boolean;
};

/**
 * Generates all possible timetables that do not violate any timetable constraints.
 * @param modules List of available modules
 * @param dayFiltersStr Times in a day to never have a lesson in a string format.
 * @returns
 */
export async function generateTimetable(modules: Module[], dayFiltersStr: DayTimeRangesStr) {
    plans = [];
    iters = 0;

    const dayFilters = dayTimeRangesStrToTime(dayFiltersStr);

    return new Promise<TimetableResponse>((resolve) => {
        iterateModules(modules, dayFilters, [], []);
        resolve({
            generatedPlans: plans,
            planLimit: plans.length >= PLAN_LIMIT,
            iterLimit: iters >= ITER_LIMIT
        });
    });
}

/**
 * Recursive function to go through all possible timetable permutations.
 * Limits itself at `PLAN_LIMIT` or `ITER_LIMIT` depending which is reached first.
 * @param modules List of available modules.
 * @param dayFilters Times in a day to never have a lesson.
 * @param indexes Current index numbers selected.
 * @param plan Current list of lessons selected.
 * @returns
 */
function iterateModules(
    modules: Module[],
    dayFilters: DayTimeRanges,
    indexes: string[],
    plan: Lesson[]
) {
    if (plans.length >= PLAN_LIMIT || iters >= ITER_LIMIT) return;

    if (modules.length === 0) {
        iters++;
        if (checkValid(plan, dayFilters)) plans = [...plans, plan];
        return;
    }

    const mod = modules[0];
    const newModules = [...modules];
    newModules.shift();

    for (const [index, lessons] of Object.entries(mod.index_numbers)) {
        const curLessons = [...plan, ...lessons];
        const curIndexes = [...indexes, index];
        iterateModules(newModules, dayFilters, curIndexes, curLessons);
    }
}

/**
 * For all available lessons, check if there are no clashes between lessons
 * or time of day constraints are all valid.
 * @param plan Array of all lessons.
 * @param dayFilters Times in a day to never have a lesson.
 * @returns Flag whether the lessons in the plan are valid.
 */
function checkValid(plan: Lesson[], dayFilters: DayTimeRanges) {
    for (const day of DAYS_FULL) {
        const dayLessons = plan.filter((l) => l.day === day);
        dayLessons.sort((a, b) => a.start_time - b.start_time);

        const skipTimes = dayFilters[day] ?? [];

        if (dayLessons.length === 0) continue;

        let curInterval: TimeRange = {
            code: dayLessons[0].module_code,
            start: dayLessons[0].start_time,
            end: dayLessons[0].end_time
        };

        for (let i = 1; i < dayLessons.length; i++) {
            const dayLesson = dayLessons[i];

            if (
                shouldSkipInterval(curInterval, skipTimes) ||
                (curInterval.end > dayLesson.start_time &&
                    curInterval.code != dayLesson.module_code)
            ) {
                return false;
            } else if (
                curInterval.code === dayLesson.module_code &&
                curInterval.end < dayLesson.end_time
            )
                curInterval.end = dayLesson.end_time;
            else
                curInterval = {
                    code: dayLesson.module_code,
                    start: dayLesson.start_time,
                    end: dayLesson.end_time
                };
        }

        if (shouldSkipInterval(curInterval, skipTimes)) return false;
    }

    return true;
}

/**
 * Given a time interval, check if the times to be free constraint is valid.
 * @param curInterval Current time interval of the lessons.
 * @param skipTimes All times reserved for the day.
 * @returns Flag whether the interval complies to the skipTimes rules.
 */
function shouldSkipInterval(curInterval: TimeRange, skipTimes: TimeRange[]) {
    return skipTimes.some((time) => {
        return (
            (curInterval.start >= time.start && curInterval.start <= time.end) ||
            (curInterval.start <= time.start && curInterval.end >= time.start) ||
            (curInterval.start <= time.start && curInterval.end >= time.end) ||
            (curInterval.start >= time.start && curInterval.end <= time.end)
        );
    });
}
