import { db } from '$lib/search/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function load({ params }) {
    const { moduleCode, semesterId } = params;

    const modulesCollection = collection(db, 'modules');
    const modulesQuery = query(
        modulesCollection,
        where('code', '==', moduleCode),
        where('semester', '==', semesterId)
    );

    const querySnapshot = await getDocs(modulesQuery);
    const documents = querySnapshot.docs;

    if (documents.length == 0) {
        error(404, { message: `Module ${moduleCode} not found!` });
    } else {
        const module = querySnapshot.docs.map((doc) => doc.data())[0] as Module;
        return { semesterId, module };
    }
}
