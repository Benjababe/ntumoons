<script lang="ts">
    import Spinner from '$lib/components/generic/Spinner.svelte';
    import Paginator from '$lib/components/search/Paginator.svelte';
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import type {
        SearchResponse,
        SearchResponseFacetCountSchema,
        SearchResponseHit
    } from 'typesense/lib/Typesense/Documents';
    import MultiFilterButton from './MultiFilterButton.svelte';
    import { callSearchPath, type DispatchFilterUpdate } from './search-helper';
    import type { Docs, Filter, FilterMap } from '$lib/types/Typesense';

    export let collection: 'modules' | 'staff';
    export let searchPlaceholder: string = '';

    const TYPESENSE_PER_PAGE = 10;
    const PAGINATOR_WIDTH = 5;

    let hits: SearchResponseHit<Docs>[] = [];
    let searchValue = '';
    let searchFilters: FilterMap = {};
    let activeFilters: FilterMap = {};
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    onMount(() => {
        search({ initCall: true });
    });

    function reset() {
        updatePaginator(1, 0);
        hits = [];
        found = 0;
    }

    function handleFilterUpdate({ name, newFilters }: DispatchFilterUpdate) {
        activeFilters[name] = newFilters;
        search();
    }

    function handleSearch() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(search, 500);
    }

    async function search({ page = 1, initCall = false } = {}) {
        searching = true;

        const res = await callSearchPath(
            collection,
            searchValue,
            initCall,
            page,
            found,
            TYPESENSE_PER_PAGE,
            activeFilters
        );

        if (!res.ok) {
            searching = false;
            reset();
            return;
        }

        const resJson = await res.json();
        const tsRes: SearchResponse<Docs> = resJson['tsRes'];

        if (initCall && tsRes.facet_counts !== undefined) {
            handleFacets(tsRes.facet_counts);
        }

        if (tsRes.hits === undefined) {
            searching = false;
            reset();
            return;
        }

        updatePaginator(tsRes.page, tsRes.found);
        hits = tsRes.hits;
        activePage = page;
        found = tsRes.found;

        document.body.scrollIntoView();
        searching = false;
    }

    function handleFacets(facetCounts: SearchResponseFacetCountSchema<Docs>[]) {
        for (const facet of facetCounts) {
            const filters: Filter[] = facet.counts
                .filter(({ value }) => value !== '')
                .map(({ value, count }) => ({
                    name: value,
                    count,
                    enabled: false
                }));
            searchFilters[facet.field_name] = filters;
        }
    }

    function updatePaginator(page: number, found: number) {
        const totalPages = Math.ceil(found / TYPESENSE_PER_PAGE);
        const start = Math.max(1, page - Math.floor(PAGINATOR_WIDTH / 2));
        const end = Math.min(totalPages, page + Math.floor(PAGINATOR_WIDTH / 2));
        pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
</script>

<div class="flex flex-col justify-center items-center max-w-1200">
    <input
        type="text"
        placeholder={searchPlaceholder}
        class="input input-bordered w-full max-w-xl"
        disabled={searching}
        bind:value={searchValue}
        on:input={handleSearch}
    />

    <div>
        {#each Object.entries(searchFilters) as [name, filters]}
            <MultiFilterButton
                {name}
                {filters}
                on:filterUpdate={(e) => handleFilterUpdate(e.detail)}
            />
        {/each}
    </div>

    <div class="mt-4 mb-2">
        {#if found > 0}
            {$t('Components.Search.FilterButton.Results found', { found })}
        {:else if searchValue != '' || Object.entries(activeFilters).length > 0}
            {$t('Components.Search.FilterButton.No results found')}
        {/if}
    </div>

    <div class="search-results max-w-4xl">
        {#if searching}
            <Spinner />
        {:else}
            {#each hits as hit (hit.document)}
                <slot {hit} />
            {/each}
        {/if}
    </div>

    {#if !searching && found > 0}
        <Paginator
            {pages}
            {activePage}
            on:pageChange={(e) => search({ page: e.detail })}
        />
    {/if}
</div>

<style>
    :global(.search-results > * mark) {
        color: var(--bc);
        background-color: inherit;
        font-weight: 700;
        text-decoration: underline;
    }
</style>
