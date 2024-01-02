import { COLL_MODULES, db } from '$lib/search/firebase';
import type { Module } from '$lib/types/Firebase.js';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function load({ params }) {
    const { moduleCode, year, semesterNum } = params;
    const semesterTitle = getSemesterTitle(year, semesterNum);

    let documents = await getModuleDocs(moduleCode, semesterNum, year);

    if (documents.length == 0) {
        documents = await getModuleDocs(moduleCode);

        if (documents.length == 0) error(404, { message: `Module ${moduleCode} not found!` });
        else {
            const module = documents.map((doc) => doc.data())[0] as Module;
            return { year, semesterNum, module, semesterTitle, currentSemester: false };
        }
    } else {
        const module = documents.map((doc) => doc.data())[0] as Module;
        return { year, semesterNum, module, semesterTitle, currentSemester: true };
    }
}

async function getModuleDocs(code: string, semesterNum: string = '', year: string = '') {
    const wheres = [where('code', '==', code)];
    if (semesterNum != '') wheres.push(where('semester_num', '==', semesterNum));
    if (year != '') wheres.push(where('year', '==', year));

    const modulesCollection = collection(db, COLL_MODULES);
    const modulesQuery = query(modulesCollection, ...wheres);

    const querySnapshot = await getDocs(modulesQuery);
    const documents = querySnapshot.docs;
    return documents;
}

function getSemesterTitle(year: string, semesterNum: string) {
    const ay = `${year}/${parseInt(year.slice(-2)) + 1}`;
    return `AY ${ay} Semester ${semesterNum}`;
}
