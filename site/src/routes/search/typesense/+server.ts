import { searchModules, searchStaff } from '$lib/search/typesense';
import type { TypesenseSearch } from '$lib/types/Search.js';
import type { ModuleDoc, StaffDoc } from '$lib/types/Typesense.js';
import { error, json } from '@sveltejs/kit';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';

export async function POST({ request }) {
    const data = (await request.json()) as TypesenseSearch;
    const { coll, q, page, per_page, filters } = data;
    let tsRes: SearchResponse<ModuleDoc> | SearchResponse<StaffDoc>;

    if (coll === 'modules') {
        tsRes = await searchModules({ q, page, per_page, filters });
    } else if (coll === 'staff') {
        tsRes = await searchStaff({ q, page, per_page, filters });
    } else {
        return error(400, 'No collection provided!');
    }

    if (tsRes.hits === undefined || tsRes.hits.length === 0)
        return error(404, 'No documents found');

    return json({ tsRes });
}
