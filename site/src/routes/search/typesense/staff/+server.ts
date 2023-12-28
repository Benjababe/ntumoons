import { typesense, COLLECTION_STAFF } from '$lib/search/typesense';
import { error, json } from '@sveltejs/kit';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

export async function POST({ request }) {
    const { initCall, q, page, per_page, filters } = await request.json();
    let queryParams: SearchParams = {
        q,
        query_by: ['title', 'description'],
        page,
        per_page,
        snippet_threshold: 5000,
        filter_by: filters
    };

    if (initCall) {
        queryParams = { ...queryParams, facet_by: '*', max_facet_values: 50 };
    }

    const tsRes = await typesense.collections(COLLECTION_STAFF).documents().search(queryParams);
    if (tsRes.hits === undefined || tsRes.hits.length === 0) return error(404, 'No staff found');

    return json({ tsRes });
}
