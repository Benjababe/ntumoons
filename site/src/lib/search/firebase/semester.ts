import { collection, getDocs, query, where } from 'firebase/firestore';
import { COLL_SEMESTER, db } from '.';
import type { Semester } from '$lib/types/Firebase';

/**
 * Retrieve all semesters available in firebase.
 * @returns Array of available semesters.
 */
export async function getSemesters() {
    const semCollection = collection(db, COLL_SEMESTER);
    const semQuery = query(semCollection, where('shown', '==', true));
    const querySnapshot = await getDocs(semQuery);
    const semesters = querySnapshot.docs.map((doc) => doc.data());
    return semesters as Semester[];
}
