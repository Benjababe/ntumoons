import { db } from '$lib/search/firebase';
import { error } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

type Metadata = {
    keywords: string[];
    tags: string[];
};

export async function load() {
    const metadataRef = doc(db, 'staff', 'metadata');
    const docSnapshot = await getDoc(metadataRef);

    if (docSnapshot.exists()) {
        const { keywords, tags } = docSnapshot.data() as Metadata;
        return { keywords, tags };
    } else {
        const message = 'Staff metadata not found! Please check firestore under "staff/metadata".';
        error(404, { message });
    }
}
