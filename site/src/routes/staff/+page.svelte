<script lang="ts">
    import MultiFilterButton from '$lib/components/search/MultiFilterButton.svelte';
    import Paginator from '$lib/components/search/Paginator.svelte';
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import type { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents';

    export let data;

    const TYPESENSE_PER_PAGE = 10;
    const PAGINATOR_WIDTH = 5;

    let staffHits: SearchResponseHit<TypesenseStaffDoc>[] = [];
    let searchValue = '';
    let activeFilters: { [key: string]: string[] } = {};
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    onMount(() => {
        searchStaff();
    });

    function handleFilterUpdate({ name, newFilters }: DispatchFilterUpdate) {
        activeFilters[name] = newFilters;
        searchStaff();
    }

    function handleSearch() {
        searching = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(searchStaff, 500);
    }

    async function searchStaff(page = 1) {
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

        const res = await fetch('/search/typesense/staff', {
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

        if (!res.ok) {
            updatePaginator(1, 0);
            staffHits = [];
            found = 0;
            return;
        }

        const resJson = await res.json();
        const tsRes: SearchResponse<TypesenseStaffDoc> = resJson['tsRes'];

        if (tsRes.hits === undefined) return;

        updatePaginator(tsRes.page, tsRes.found);
        staffHits = tsRes.hits;
        activePage = page;
        found = tsRes.found;

        document.body.scrollIntoView();
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
        placeholder={$t('Staff.Search.Enter name or description')}
        class="input input-bordered w-full max-w-xl"
        bind:value={searchValue}
        on:input={handleSearch}
    />
    <div>
        <MultiFilterButton
            class="mt-2"
            name="tag"
            filterList={data.tags}
            on:filterChange={(e) => handleFilterUpdate(e.detail)}
        />
        <MultiFilterButton
            class="mt-2"
            name="keywords"
            filterList={data.keywords}
            on:filterChange={(e) => handleFilterUpdate(e.detail)}
        />
    </div>
    {#if found > 0 && searchValue.length > 0}
        <div class="my-2">
            {t.get('Staff.Search.Total Found', { found })}
        </div>
    {/if}
    <div class="search-results max-w-4xl">
        {#each staffHits as hit (hit.document.email)}
            <div class="flex gap-4 mt-8 mb-4">
                <div class="m-auto w-1/6">
                    <a href="/staff/{hit.document.email}">
                        <img
                            class="w-full aspect-staff-photo object-cover object-center"
                            src={hit.document.profile_pic_url}
                            alt={hit.document.title}
                        />
                    </a>
                </div>
                <div class="w-5/6 text-sm">
                    <a
                        href="/staff/{hit.document.email}"
                        class="text-primary text-xl"
                    >
                        {@html hit.highlight.title
                            ? hit.highlight.title.snippet
                            : hit.document.title}
                    </a>
                    <div>{hit.document.tag}</div>
                    <div class="divider mt-0 mb-2" />
                    <div>
                        {#if hit.document.description !== ''}
                            {@html hit.highlight.description
                                ? hit.highlight.description.snippet
                                : hit.document.description}
                        {:else}
                            {$t('Staff.Search.No description provided')}
                        {/if}
                    </div>
                    <div class="mt-4">
                        <div class="font-semibold">Appointments:</div>
                        {#each hit.document.appointments as appointment}
                            <div>{appointment}</div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    {#if found > TYPESENSE_PER_PAGE}
        <Paginator
            {pages}
            {activePage}
            on:pageChange={(e) => searchStaff(e.detail)}
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
