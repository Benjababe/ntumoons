import { COLL_STAFF, db } from '$lib/search/firebase';
import type { Staff } from '$lib/types/Firebase.js';
import { error } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function load({ params }) {
    const { email } = params;

    const modulesCollection = collection(db, COLL_STAFF);
    const modulesQuery = query(modulesCollection, where('email', '==', email));

    const querySnapshot = await getDocs(modulesQuery);
    const documents = querySnapshot.docs;

    if (documents.length == 0) {
        error(404, { message: `Staff with email ${email} not found!` });
    } else {
        const staff = querySnapshot.docs.map((doc) => doc.data())[0] as Staff;
        return { staff };
    }
}
