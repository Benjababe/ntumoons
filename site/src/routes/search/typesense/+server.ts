import { typesense, COLLECTION_STAFF, COLLECTION_MODULES } from '$lib/search/typesense';
import type { TypesenseSearch } from '$lib/types/Search.js';
import type { CollectionNames } from '$lib/types/Typesense.js';
import { error, json } from '@sveltejs/kit';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

// Default fields to query by
const queryFields = {
    modules: ['code', 'name_pretty', 'description'],
    staff: ['title', 'description']
};

// Default fields to sort by
const sortBy = {
    modules: '_text_match:desc, code:asc',
    staff: ''
};

// Default filters to include even without specifying
const forceFilters = {
    modules: ['verified:true '],
    staff: []
};

export async function POST({ request }) {
    const data = (await request.json()) as TypesenseSearch;
    const { coll, q, page, per_page } = data;
    let { filters } = data;

    let collection: CollectionNames;
    if (coll === 'modules') {
        collection = COLLECTION_MODULES;
    } else if (coll === 'staff') {
        collection = COLLECTION_STAFF;
    } else {
        return error(400, 'No collection provided!');
    }

    if (forceFilters[collection].length > 0) {
        filters += filters.trim().length > 0 ? ', ' : '';
        filters += forceFilters[collection];
    }

    const queryParams: SearchParams = {
        q,
        query_by: queryFields[collection],
        sort_by: sortBy[collection],
        page,
        per_page,
        snippet_threshold: 5000,
        filter_by: filters,
        facet_by: '*',
        max_facet_values: 50
    };

    const tsRes = await typesense.collections(collection).documents().search(queryParams);
    if (tsRes.hits === undefined || tsRes.hits.length === 0)
        return error(404, 'No documents found');

    return json({ tsRes });
}
