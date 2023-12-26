<script lang="ts">
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import type { SearchResponseHit, SearchResponse } from 'typesense/lib/Typesense/Documents';

    const TYPESENSE_PER_PAGE = 10;
    const PAGINATOR_WIDTH = 5;
    const DOUBLE_LEFT = '«';
    const DOUBLE_RIGHT = '»';

    let moduleHits: SearchResponseHit<TypesenseModuleDoc>[] = [];
    let searchValue = '';
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    onMount(() => {
        searchModules();
    });

    function handleSearch() {
        searching = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(searchModules, 500);
    }

    async function searchModules(page = 1) {
        const res = await fetch('/search/typesense/module', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: searchValue, page, per_page: TYPESENSE_PER_PAGE })
        });

        if (!res.ok) return;

        const resJson = await res.json();
        const tsRes: SearchResponse<TypesenseModuleDoc> = resJson['tsRes'];

        if (tsRes.hits === undefined) return;

        updatePaginator(tsRes.page, tsRes.found);
        moduleHits = tsRes.hits;
        activePage = page;
        found = tsRes.found;

        document.body.scrollIntoView();
    }

    function updatePaginator(page: number, found: number) {
        const totalPages = Math.ceil(found / TYPESENSE_PER_PAGE);
        const start = Math.max(1, page - Math.floor(PAGINATOR_WIDTH));
        const end = Math.min(totalPages, page + Math.floor(PAGINATOR_WIDTH));

        let tmpPages = [];
        for (let i = start; i <= end; i++) tmpPages.push(i);

        pages = tmpPages;
    }
</script>

<div class="flex flex-col justify-center items-center max-w-1200">
    <input
        type="text"
        placeholder={$t('Modules.Search.Enter course code, name or descriptions')}
        class="input input-bordered w-full max-w-xl"
        bind:value={searchValue}
        on:input={handleSearch}
    />
    {#if found > 0 && searchValue.length > 0}
        <div class="my-2">
            {t.get('Modules.Search.TotalFound', { found })}
        </div>
    {/if}
    <div class="module-results max-w-4xl">
        {#each moduleHits as hit}
            <div class="mt-8 mb-4">
                <a
                    href="/modules/{hit.document.year}/{hit.document.semester_num}/{hit.document
                        .code}"
                    class="text-primary text-xl"
                >
                    {@html hit.highlight.code ? hit.highlight.code.snippet : hit.document.code}
                    {@html hit.highlight.name_pretty
                        ? hit.highlight.name_pretty.snippet
                        : hit.document.name_pretty}
                </a>
                <div class="divider mt-0 mb-2" />
                <div class="module-results-desc">
                    {@html hit.highlight.description
                        ? hit.highlight.description.snippet
                        : hit.document.description}
                </div>
            </div>
        {/each}
    </div>
    {#if pages.length > 0}
        <div class="join mt-8">
            {#if activePage > 1}
                <button
                    class="join-item btn btn-md"
                    on:click|preventDefault={() => searchModules(1)}
                >
                    {DOUBLE_LEFT}
                </button>
            {/if}
            {#each pages as pageNum}
                <button
                    class="join-item btn btn-md {pageNum === activePage ? 'btn-active' : ''}"
                    on:click|preventDefault={() => searchModules(pageNum)}
                >
                    {pageNum}
                </button>
            {/each}
            {#if activePage !== pages[pages.length - 1]}
                <button
                    class="join-item btn btn-md"
                    on:click|preventDefault={() => searchModules(pages[pages.length - 1])}
                >
                    {DOUBLE_RIGHT}
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>
    :global(.module-results > * mark) {
        color: var(--bc);
        background-color: inherit;
        font-weight: 700;
        text-decoration: underline;
    }
</style>
