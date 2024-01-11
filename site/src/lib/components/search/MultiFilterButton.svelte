<script lang="ts">
    import ArrowDown from '$lib/assets/images/ArrowDown.svelte';
    import { t } from '$lib/translations';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Filter } from '$lib/types/Typesense';
    import type { DispatchFilterUpdate } from '$lib/types/Dispatch';

    export let name: string = '';
    export let filters: Filter[] = [];

    const dispatch = createEventDispatcher<{ filterUpdate: DispatchFilterUpdate }>();
    let filterSearch = '';

    function checkFilterSearch(filterValue: string) {
        if (filterValue.toLowerCase().includes(filterSearch.toLowerCase())) return '';
        return 'hidden';
    }

    function clearFilters() {
        // Do not use map here, bugs out
        for (let i = 0; i < filters.length; i++) filters[i].enabled = false;
        handleFilterUpdate();
    }

    function handleFilterUpdate() {
        const filtersEnabled = filters.filter((f) => f.enabled);
        dispatch('filterUpdate', { name, newFilters: filtersEnabled });
    }

    // On mount, check url for any filters to set initially.
    onMount(() => {
        let updated = false;
        const params = new URLSearchParams(window.location.search);
        const filterNames = params.getAll(name);

        for (const filterName of filterNames) {
            for (let i = 0; i < filters.length; i++) {
                if (filters[i].name === filterName) {
                    filters[i].enabled = true;
                    updated = true;
                    break;
                }
            }
        }

        if (updated) handleFilterUpdate();
    });
</script>

<div class="dropdown {$$props.class}">
    <div
        tabindex="0"
        role="button"
        class="focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
    >
        <span class="capitalize">{$t('Components.Search.FilterButton.Filter By', { name })}</span>
        <div class="w-4 h-4 ml-2"><ArrowDown /></div>
    </div>
    <div
        class="w-64 p-2 mt-2 border-2 border-solid shadow dropdown-content menu rounded-box bg-base-100 border-primary"
    >
        <input
            type="text"
            placeholder={$t('Components.Search.FilterButton.Search filters...')}
            class="w-full max-w-xs input input-bordered input-sm"
            bind:value={filterSearch}
        />
        {#if filters.some((f) => f.enabled)}
            <div class="flex justify-end pr-1 mt-3">
                <button
                    class="btn btn-accent btn-xs"
                    on:click|preventDefault={clearFilters}
                >
                    {$t('Components.Search.FilterButton.Clear filters')}
                </button>
            </div>
        {/if}
        <div class="mt-0 mb-1 divider" />
        <ol class="pr-1 space-y-2 overflow-y-scroll text-sm max-h-64">
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
