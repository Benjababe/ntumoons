/**
 * Converts semester id into year and semester number.
 * @param id Semester in YYYY;S format
 * @returns Object containing year and semester separate
 */
export function semesterIdToSemYear(id: string) {
    const idSpl = id.trim().split(';');
    return { year: idSpl[0], semesterNum: idSpl[1] };
}

/**
 * Converts a year and semester number into a more readable format.
 * @param year Year of the semester in YYYY format (Eg. 2023).
 * @param semesterNum Semester number in S format (Either 1 or 2).
 * @returns Semester in title form (Eg. AY 2023/24 Semester 1).
 */
export function getSemesterTitle(year: string, semesterNum: string) {
    const ay = `${year}/${parseInt(year.slice(-2)) + 1}`;
    return `AY ${ay} Semester ${semesterNum}`;
}
