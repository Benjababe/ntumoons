import { typesense, COLLECTION_MODULE } from '$lib/search/typesense';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { q, page, per_page } = await request.json();
    const queryParams = {
        q,
        query_by: ['name_pretty', 'code', 'description'],
        page,
        per_page,
        snippet_threshold: 5000
    };
    const tsRes = await typesense.collections(COLLECTION_MODULE).documents().search(queryParams);
    if (tsRes.hits === undefined || tsRes.hits.length === 0) return error(404, 'No modules found');

    return json({ tsRes });
}
