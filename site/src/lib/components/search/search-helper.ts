import type { Docs, Filter, FilterMap } from '$lib/types/Typesense';
import type { SearchResponseFacetCountSchema } from 'typesense/lib/Typesense/Documents';

export type DispatchFilterUpdate = {
    name: string;
    newFilters: Filter[];
};

export const PER_PAGE = 10;

/**
 * Helper function to call the typesense route
 * @param collection Name of collection to search in
 * @param searchValue Query value
 * @param initCall Flag whether it is the initial page load
 * @param page Page number offset of the query
 * @param per_page Number of results per page
 * @param activeFilters Filters to be used in the query
 * @returns
 */
export async function callSearchPath(
    collection: string,
    searchValue: string,
    initCall: boolean,
    page = 1,
    per_page = PER_PAGE,
    activeFilters: FilterMap = {}
) {
    const res = await fetch('/search/typesense', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            initCall,
            coll: collection,
            q: searchValue,
            page,
            per_page: per_page,
            filters: getFilters(activeFilters)
        })
    });

    return res;
}

/**
 * Converts all facet filters into a single string
 * to be passed as the Typesense query filter.
 * @param activeFilters Object containing all enabled facet filters
 * @returns {string} Query filter string
 */
function getFilters(activeFilters: FilterMap) {
    const tsFilters = Object.entries(activeFilters)
        .filter(([, filters]) => filters.length > 0)
        .map(([facet, filters]) => {
            filters = filters.filter((f) => f.enabled);
            const filterStr = `[${filters.map((f) => `\`${f.name}\``).join(', ')}]`;
            return `${facet}:=${filterStr}`;
        });

    return tsFilters.join(' && ');
}

/**
 * Converts facets returned from initial query into a clearer known structure
 */
export function parseFacets(facetCounts: SearchResponseFacetCountSchema<Docs>[]) {
    const tmpFilters: FilterMap = {};
    for (const facet of facetCounts) {
        const filters: Filter[] = facet.counts
            .filter(({ value }) => value !== '')
            .map(({ value, count }) => ({
                name: value,
                count,
                enabled: false
            }));
        tmpFilters[facet.field_name] = filters;
    }
    return tmpFilters;
}
