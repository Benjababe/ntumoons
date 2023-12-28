import { COLL_MODULES, db } from '$lib/search/firebase';
import { json } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function POST({ request }) {
    const { code, semesterId } = await request.json();

    const modulesCollection = collection(db, COLL_MODULES);
    const modulesQuery = query(
        modulesCollection,
        where('code', '==', code),
        where('semester', '==', semesterId)
    );

    const querySnapshot = await getDocs(modulesQuery);
    const module = querySnapshot.docs.map((doc) => doc.data())[0];
    return json(module);
}
