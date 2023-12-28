<script lang="ts">
    import ArrowDown from '$lib/assets/images/ArrowDown.svelte';
    import { t } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';
    import type { DispatchFilterUpdate } from './search-helper';
    import type { Filter } from '$lib/types/Typesense';

    export let name: string = '';
    export let filters: Filter[] = [];

    const dispatch = createEventDispatcher<{ filterUpdate: DispatchFilterUpdate }>();
    let filterSearch = '';

    function checkFilterSearch(filterValue: string) {
        if (filterValue.toLowerCase().includes(filterSearch.toLowerCase())) return '';
        return 'hidden';
    }

    function clearFilters() {
        filters = filters.map((f) => ({ ...f, enabled: false }));
        handleFilterUpdate();
    }

    function handleFilterUpdate() {
        const filtersEnabled = filters.filter((f) => f.enabled);
        dispatch('filterUpdate', { name, newFilters: filtersEnabled });
    }
</script>

<div class="dropdown {$$props.class}">
    <div
        tabindex="0"
        role="button"
        class="focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
    >
        <span class="capitalize">{$t('Components.Search.FilterButton.Filter By', { name })}</span>
        <div class="ml-2 h-4 w-4"><ArrowDown /></div>
    </div>
    <div
        class="dropdown-content menu p-2 shadow rounded-box w-64 mt-2 bg-base-100 border-2 border-solid border-primary"
    >
        <input
            type="text"
            placeholder={$t('Components.Search.FilterButton.Search filters...')}
            class="input input-bordered input-sm w-full max-w-xs"
            bind:value={filterSearch}
        />
        <div class="flex justify-end mt-3 pr-1">
            <button
                class="btn btn-accent btn-xs"
                on:click|preventDefault={clearFilters}
            >
                {$t('Components.Search.FilterButton.Clear filters')}
            </button>
        </div>
        <div class="divider mt-0 mb-1" />
        <ol class="text-sm space-y-2 max-h-64 pr-1 overflow-y-scroll">
            {#each filters as { name, count }, i (`${name}_${filterSearch}`)}
                <li class="flex flex-row items-center {checkFilterSearch(name)}">
                    <input
                        id="chk_{name}"
                        type="checkbox"
                        class="w-1/6 h-4 rounded"
                        bind:checked={filters[i].enabled}
                        on:change={handleFilterUpdate}
                    />
                    <!-- Allow this here as the label would just close the dropdown menu -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <label
                        for="chk_{name}"
                        class="w-5/6 px-1 py-1 text-sm font-medium"
                        on:mousedown|preventDefault={() => {}}
                        on:keydown|preventDefault={() => {}}
                    >
                        {name} ({count})
                    </label>
                </li>
            {/each}
        </ol>
    </div>
</div>
