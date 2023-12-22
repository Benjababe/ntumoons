import { db } from '$lib/search/firebase';
import { json } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
    const semCollection = collection(db, 'semester');
    const semQuery = query(semCollection, where('active', '==', true));
    const querySnapshot = await getDocs(semQuery);
    const semester = querySnapshot.docs.map((doc) => doc.data());
    return json(semester[0]);
}
