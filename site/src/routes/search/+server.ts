import { typesense, COLLECTION_MODULE } from '$lib/typesense';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { q } = await request.json();
    const queryParams = {
        q,
        query_by: ['name', 'code']
    };
    const res = await typesense.collections(COLLECTION_MODULE).documents().search(queryParams);
    return json(res);
}
