import { COLL_MODULES, db } from '$lib/search/firebase';
import type { Module } from '$lib/types/Firebase.js';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function load({ params }) {
    const { moduleCode, year, semesterNum } = params;

    const modulesCollection = collection(db, COLL_MODULES);
    const modulesQuery = query(
        modulesCollection,
        where('code', '==', moduleCode),
        where('semester_num', '==', semesterNum),
        where('year', '==', year)
    );

    const querySnapshot = await getDocs(modulesQuery);
    const documents = querySnapshot.docs;

    if (documents.length == 0) {
        error(404, { message: `Module ${moduleCode} not found!` });
    } else {
        const module = querySnapshot.docs.map((doc) => doc.data())[0] as Module;
        return { year, semesterNum, module };
    }
}
