import { COLL_SEMESTER, db } from '$lib/search/firebase';
import { json } from '@sveltejs/kit';
import { collection, getDocs, query } from 'firebase/firestore';

export async function GET() {
    const semCollection = collection(db, COLL_SEMESTER);
    const semQuery = query(semCollection);
    const querySnapshot = await getDocs(semQuery);
    const semester = querySnapshot.docs.map((doc) => doc.data());
    return json(semester);
}
