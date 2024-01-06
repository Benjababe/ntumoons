import type { TypesenseSearch } from '$lib/types/Search';
import type { SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents';
import { COLL_MODULES, typesense } from '.';
import type { ModuleDoc } from '$lib/types/Typesense';

const queryFields = ['code', 'name_pretty', 'description'];
const sortBy = '_text_match:desc, code:asc';
const forceFilter = 'verified:true ';

export async function searchModules({ q, page, per_page, filters }: TypesenseSearch) {
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

    const tsRes = await typesense.collections(COLL_MODULES).documents().search(queryParams);
    return tsRes as SearchResponse<ModuleDoc>;
}
