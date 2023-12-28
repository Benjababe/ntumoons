import type { Filter, FilterMap } from '$lib/types/Typesense';

export type DispatchFilterUpdate = {
    name: string;
    newFilters: Filter[];
};

/**
 * Helper function to call the typesense route
 * @param collection
 * @param searchValue
 * @param initCall
 * @param page
 * @param found
 * @param per_page
 * @param activeFilters
 * @returns
 */
export async function callSearchPath(
    collection: string,
    searchValue: string,
    initCall: boolean,
    page = 1,
    found = 0,
    per_page = 10,
    activeFilters: FilterMap = {}
) {
    if (page === -1) {
        page = found === 0 ? page : Math.ceil(found / per_page);
    }

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
