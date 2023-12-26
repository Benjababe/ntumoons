<script lang="ts">
    import { t } from '$lib/translations';
    import type { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents';

    const TYPESENSE_PER_PAGE = 10;
    const PAGINATOR_WIDTH = 5;
    const DOUBLE_LEFT = '«';
    const DOUBLE_RIGHT = '»';

    let staffHits: SearchResponseHit<TypesenseStaffDoc>[] = [];
    let searchValue = '';
    let searching = false;
    let found = 0;
    let activePage = 1;
    let pages: number[] = [];
    let timeout: NodeJS.Timeout;

    function handleSearch() {
        searching = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(searchStaff, 500);
    }

    async function searchStaff(page = 1) {
        if (!searchValue) {
            staffHits = [];
            searching = false;
            return;
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
                filters: ''
            })
        });

        if (!res.ok) return;

        const resJson = await res.json();
        const tsRes: SearchResponse<TypesenseStaffDoc> = resJson['tsRes'];
        console.log(tsRes);

        if (tsRes.hits === undefined) return;

        updatePaginator(tsRes.page, tsRes.found);
        staffHits = tsRes.hits;
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
        placeholder={$t('Staff.Enter name or description')}
        class="input input-bordered w-full max-w-xl"
        bind:value={searchValue}
        on:input={handleSearch}
    />
</div>
