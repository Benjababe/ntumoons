<script lang="ts">
    import { goto } from '$app/navigation';
    import Spinner from '$lib/components/generic/Spinner.svelte';
    import Paginator from '$lib/components/search/Paginator.svelte';
    import { t } from '$lib/translations';
    import type { Docs, FilterMap, ModuleDoc, StaffDoc } from '$lib/types/Typesense';
    import { onMount } from 'svelte';
    import type { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents';
    import MultiFilterButton from './MultiFilterButton.svelte';
    import {
        PER_PAGE,
        callSearchPath,
        parseFacets,
        type DispatchFilterUpdate
    } from './search-helper';

    export let collection: 'modules' | 'staff';
    export let searchPlaceholder: string = '';

    // A workaround way to return hits in their proper typing to the parent.
    // Ideally it would just be 1 'hits' variable with union types for all possible docs.
    // But typescript doesn't play well with svelte and a single type cannot be chosen as output.
    export let staffHits: SearchResponseHit<StaffDoc>[] = [];
    export let moduleHits: SearchResponseHit<ModuleDoc>[] = [];

    /**
     * Filters are stored key-value pairs,
     * each pair being each selectable filter and its values.
     *
     * Eg.
     * {
     *   'keyword': [Filter(), Filter(), ...],
     *   'tag': [Filter(), Filter()]
     * }
     */
    let searchFilters: FilterMap = {};
    let activeFilters: FilterMap = {};

    let searchValue = '';
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    onMount(() => {
        parseParams();
        search({ page: activePage, initCall: true });
    });

    function reset() {
        updatePaginator(1, 0);
        staffHits = [];
        moduleHits = [];
        found = 0;
        searching = false;
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

        const res = await callSearchPath(collection, searchValue, page, PER_PAGE, activeFilters);

        if (!res.ok) {
            reset();
            return;
        }

        const resJson = await res.json();
        const tsRes: SearchResponse<Docs> = resJson['tsRes'];

        if (tsRes.facet_counts !== undefined) {
            searchFilters = parseFacets(searchFilters, tsRes.facet_counts);
        }

        if (tsRes.hits === undefined) {
            reset();
            return;
        }

        updatePaginator(tsRes.page, tsRes.found);
        found = tsRes.found;

        staffHits = tsRes.hits as SearchResponseHit<StaffDoc>[];
        moduleHits = tsRes.hits as SearchResponseHit<ModuleDoc>[];

        if (!initCall) updateUrl();

        document.body.scrollIntoView();
        searching = false;
    }

    function updatePaginator(page: number, found: number) {
        const PAGINATOR_MAX_WIDTH = 5;
        const totalPages = Math.ceil(found / PER_PAGE);
        const start = Math.max(1, page - Math.floor(PAGINATOR_MAX_WIDTH / 2));
        const end = Math.min(totalPages, page + Math.floor(PAGINATOR_MAX_WIDTH / 2));

        activePage = page;
        pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    /**
     * Evaluates parameters provided in the url and sets the input as such.
     */
    function parseParams() {
        const params = new URLSearchParams(window.location.search);
        const paramPage = params.get('page');
        const paramSearchValue = params.get('searchValue');

        if (paramPage) activePage = parseInt(paramPage);
        if (paramSearchValue) searchValue = paramSearchValue;
    }

    /**
     * On input updates, add the input values to the url parameters
     * so the url can be reloaded with the same state.
     */
    function updateUrl() {
        let filters: string[] = [];
        for (const [facetName, facets] of Object.entries(activeFilters)) {
            let facetValues = facets.map((f) => `${facetName}=${f.name}`);
            filters = [...filters, `${facetValues.join('&')}`];
        }

        const url = `?page=${activePage}&searchValue=${searchValue}&${filters.join('&')}`;
        goto(url);
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

    <div class="mt-3 z-10">
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
        {:else if !searching && (searchValue != '' || Object.entries(activeFilters).length > 0)}
            {$t('Components.Search.FilterButton.No results found')}
        {/if}
    </div>

    <div class="search-results max-w-4xl z-0">
        {#if searching}
            <Spinner />
        {:else}
            <slot name="results" />
        {/if}
    </div>

    {#if !searching && found > 0}
        <Paginator
            {pages}
            {activePage}
            lastPage={Math.ceil(found / PER_PAGE)}
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
