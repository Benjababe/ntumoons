import { typesense, COLLECTION_STAFF, COLLECTION_MODULES } from '$lib/search/typesense';
import type { CollectionNames } from '$lib/types/Typesense.js';
import { error, json } from '@sveltejs/kit';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

const queryFields = {
    modules: ['code', 'name'],
    staff: ['title', 'description']
};

export async function POST({ request }) {
    const { coll, q, page, per_page, filters } = await request.json();

    let collection: CollectionNames;
    if (coll === 'modules') {
        collection = COLLECTION_MODULES;
    } else if (coll === 'staff') {
        collection = COLLECTION_STAFF;
    } else {
        return error(400, 'No collection provided!');
    }

    const queryParams: SearchParams = {
        q,
        query_by: queryFields[collection],
        page,
        per_page,
        snippet_threshold: 5000,
        filter_by: filters,
        facet_by: '*',
        max_facet_values: 50
    };

    const tsRes = await typesense.collections(collection).documents().search(queryParams);
    if (tsRes.hits === undefined || tsRes.hits.length === 0) return error(404, 'No staff found');

    return json({ tsRes });
}
