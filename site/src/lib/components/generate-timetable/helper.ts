import type { Lesson, Module } from '$lib/types/Firebase';

export const PLAN_LIMIT = 5000;
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
let plans: Lesson[][] = [];

export function generateTimetable(modules: Module[]) {
    plans = [];
    iterateModules(modules, [], []);
    return plans;
}

function iterateModules(modules: Module[], indexes: string[], plan: Lesson[]) {
    if (plans.length >= PLAN_LIMIT) return;

    if (modules.length === 0) {
        if (checkValid(plan)) plans = [...plans, plan];
        return;
    }

    const mod = modules[0];
    const newModules = [...modules];
    newModules.shift();

    for (const [index, lessons] of Object.entries(mod.index_numbers)) {
        const curLessons = [...plan, ...lessons];
        const curIndexes = [...indexes, index];
        iterateModules(newModules, curIndexes, curLessons);
    }
}

function checkValid(plan: Lesson[]) {
    for (const day of DAYS) {
        const dayLessons = plan.filter((l) => l.day === day);
        dayLessons.sort((a, b) => a.start_time - b.start_time);

        if (dayLessons.length === 0) continue;

        let curInterval = {
            code: dayLessons[0].module_code,
            start: dayLessons[0].start_time,
            end: dayLessons[0].end_time
        };

        for (let i = 1; i < dayLessons.length; i++) {
            const dayLesson = dayLessons[i];
            if (
                curInterval.end > dayLesson.start_time &&
                curInterval.code != dayLesson.module_code
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
    }

    return true;
}
