import type { TypesenseSearch } from '$lib/types/Search';
import type { SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents';
import { COLL_STAFF, typesense } from '.';
import type { StaffDoc } from '$lib/types/Typesense';

const queryFields = ['title', 'description'];
const sortBy = '';
const forceFilter = '';

/**
 * Make a query to Typesense based on parameters provided.
 * @param p0 Query string, page number, number of results and facet filters.
 * @returns All Typesense search results for the staff query.
 */
export async function searchStaff({ q, page, per_page, filters }: TypesenseSearch) {
    filters += filters.trim().length > 0 ? ', ' : '';
    filters += forceFilter;

    const queryParams: SearchParams = {
        q,
        query_by: queryFields,
        sort_by: sortBy,
        page,
        per_page,
        snippet_threshold: 5000,
        filter_by: filters,
        facet_by: '*',
        max_facet_values: 50
    };

    const tsRes = await typesense.collections(COLL_STAFF).documents().search(queryParams);
    return tsRes as SearchResponse<StaffDoc>;
}
