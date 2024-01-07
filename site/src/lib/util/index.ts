import type { Day } from '$lib/types/Timetable';

export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const DAYS_SHORT: Day[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
export const DAYS_FULL: Day[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
