import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { COLL_MODULES, SUB_COLL_SEMESTERS, db } from '.';
import type { Module } from '$lib/types/Firebase';

/**
 * Tries to find the module with the provided parameters
 * @param code Module code to find.
 * @param semesterNum Target semester number of the module.
 * @param year Target year of the module.
 * @returns Module document or undefined if it was not found.
 */
export async function getModuleDoc(code: string, semesterNum: string = '', year: string = '') {
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
