import { typesense, COLLECTION_STAFF, COLLECTION_MODULES } from '$lib/search/typesense';
import type { CollectionNames } from '$lib/types/Typesense.js';
import { error, json } from '@sveltejs/kit';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

const queryFields = {
    modules: ['code', 'name_pretty', 'description'],
    staff: ['title', 'description']
};

const sortBy = {
    modules: '_text_match:desc, code:asc',
    staff: ''
};

const forceFilter = {
    modules: 'verified:true ',
    staff: ''
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
        sort_by: sortBy[collection],
        page,
        per_page,
        snippet_threshold: 5000,
        filter_by: `${forceFilter[collection]} ${filters === '' ? '' : ', '}${filters}`,
        facet_by: '*',
        max_facet_values: 50
    };

    const tsRes = await typesense.collections(collection).documents().search(queryParams);
    if (tsRes.hits === undefined || tsRes.hits.length === 0)
        return error(404, 'No documents found');

    return json({ tsRes });
}
