import { COLL_MODULES, SUB_COLL_SEMESTERS, db } from '$lib/search/firebase';
import type { Module } from '$lib/types/Firebase.js';
import { error } from '@sveltejs/kit';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

export async function load({ params }) {
    const { moduleCode, year, semesterNum } = params;
    const semesterTitle = getSemesterTitle(year, semesterNum);

    // First we try to get the module for the semester provided
    let module = await getModuleDoc(moduleCode, semesterNum, year);

    // If not found, try again but without a semester constraint
    if (module === undefined) {
        module = await getModuleDoc(moduleCode);

        // If totally not found, return 404 error
        if (module === undefined) error(404, { message: `Module "${moduleCode}" not found!` });
        else return { year, semesterNum, module, semesterTitle, currentSemester: false };
    }

    // If found, sweet
    else return { year, semesterNum, module, semesterTitle, currentSemester: true };
}

/**
 * Tries to find the module with the provided parameters
 * @param code Module code to find.
 * @param semesterNum Target semester number of the module.
 * @param year Target year of the module.
 * @returns Module document or undefined if it was not found.
 */
async function getModuleDoc(code: string, semesterNum: string = '', year: string = '') {
    // First find the main document of the module
    const modulesCollection = collection(db, COLL_MODULES);
    const modulesQuery = query(modulesCollection, where('code', '==', code));
    const querySnapshot = await getDocs(modulesQuery);
    const documents = querySnapshot.docs;
    if (documents.length === 0) return undefined;

    const semesterConstraints =
        semesterNum !== '' && year !== ''
            ? [where('year', '==', year), where('semester_num', '==', semesterNum)]
            : [orderBy('semester', 'desc')];

    const semesterSubColl = collection(db, COLL_MODULES, documents[0].id, SUB_COLL_SEMESTERS);
    const semesterQuery = query(semesterSubColl, ...semesterConstraints);
    const semesterSnapshot = await getDocs(semesterQuery);
    const semesterDocs = semesterSnapshot.docs;
    if (semesterDocs.length === 0) return undefined;

    const document = { ...documents[0].data(), ...semesterDocs[0].data() } as Module;
    return document;
}

/**
 * Converts a year and semester number into a more readable format.
 * @param year Year of the semester in YYYY format (Eg. 2023).
 * @param semesterNum Semester number in S format (Either 1 or 2).
 * @returns Semester in title form (Eg. AY 2023/24 Semester 1).
 */
function getSemesterTitle(year: string, semesterNum: string) {
    const ay = `${year}/${parseInt(year.slice(-2)) + 1}`;
    return `AY ${ay} Semester ${semesterNum}`;
}
