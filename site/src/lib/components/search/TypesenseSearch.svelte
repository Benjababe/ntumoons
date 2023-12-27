<script lang="ts">
    import Paginator from '$lib/components/search/Paginator.svelte';
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import type { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents';
    import MultiFilterButton from './MultiFilterButton.svelte';

    export let searchPlaceholder: string = '';
    export let searchPath: string = '';
    export let searchFilters: { [key: string]: string[] } = {};

    const TYPESENSE_PER_PAGE = 10;
    const PAGINATOR_WIDTH = 5;

    let hits: SearchResponseHit<TypesenseStaffDoc | TypesenseModuleDoc>[] = [];
    let searchValue = '';
    let activeFilters: { [key: string]: string[] } = {};
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    onMount(() => {
        search();
    });

    function handleFilterUpdate({ name, newFilters }: DispatchFilterUpdate) {
        activeFilters[name] = newFilters;
        search();
    }

    function handleSearch() {
        searching = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(search, 500);
    }

    async function search(page = 1) {
        const res = await callSearchPath(page);
        if (!res) return;

        if (!res.ok) {
            updatePaginator(1, 0);
            hits = [];
            found = 0;
            return;
        }

        const resJson = await res.json();
        const tsRes: SearchResponse<TypesenseStaffDoc | TypesenseModuleDoc> = resJson['tsRes'];

        if (tsRes.hits === undefined) return;

        updatePaginator(tsRes.page, tsRes.found);
        hits = tsRes.hits;
        activePage = page;
        found = tsRes.found;

        document.body.scrollIntoView();
    }

    async function callSearchPath(page: number) {
        if (page === -1) {
            if (found === 0) return;
            page = Math.ceil(found / TYPESENSE_PER_PAGE);
        }

        let tsFilters: string[] = [];
        for (let [name, filters] of Object.entries(activeFilters)) {
            if (filters.length == 0) continue;

            const filterStr = `[${filters.map((f) => `\`${f}\``).join(', ')}]`;
            tsFilters = [...tsFilters, `${name}:=${filterStr}`];
        }

        const res = await fetch(searchPath, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: searchValue,
                page,
                per_page: TYPESENSE_PER_PAGE,
                filters: tsFilters.join(' && ')
            })
        });

        return res;
    }

    function updatePaginator(page: number, found: number) {
        const totalPages = Math.ceil(found / TYPESENSE_PER_PAGE);
        const start = Math.max(1, page - Math.floor(PAGINATOR_WIDTH / 2));
        const end = Math.min(totalPages, page + Math.floor(PAGINATOR_WIDTH / 2));

        let tmpPages = [];
        for (let i = start; i <= end; i++) tmpPages.push(i);

        pages = tmpPages;
    }
</script>

<div class="flex flex-col justify-center items-center max-w-1200">
    <input
        type="text"
        placeholder={searchPlaceholder}
        class="input input-bordered w-full max-w-xl"
        bind:value={searchValue}
        on:input={handleSearch}
    />
    <div>
        {#each Object.entries(searchFilters) as [name, filterList]}
            <MultiFilterButton
                {name}
                {filterList}
                on:filterUpdate={(e) => handleFilterUpdate(e.detail)}
            />
        {/each}
    </div>
    {#if found > 0 && search.length > 0}
        <div class="my-2">
            {$t('Staff.Search.Total Found', { found })}
        </div>
    {/if}
    <div class="search-results max-w-4xl">
        {#each hits as hit (hit.document)}
            <slot {hit} />
        {/each}
    </div>
    {#if found > TYPESENSE_PER_PAGE}
        <Paginator
            {pages}
            {activePage}
            on:pageChange={(e) => search(e.detail)}
        />
    {/if}
</div>
