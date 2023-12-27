<script lang="ts">
    import arrowDown from '$lib/assets/arrow-down.svg?raw';
    import { t } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';

    export let name: string = '';
    export let filterList: string[] = [];

    const dispatch = createEventDispatcher<{ filterUpdate: DispatchFilterUpdate }>();
    let checkedFilters: boolean[] = new Array(filterList.length).fill(false);
    let filterSearch = '';

    function checkFilterSearch(filter: string) {
        if (filter.toLowerCase().includes(filterSearch.toLowerCase())) return '';
        return 'hidden';
    }

    function handleFilterUpdate() {
        const filtersEnabled = checkedFilters
            .map((f, i) => (f ? filterList[i] : ''))
            .filter((f) => f !== '');

        dispatch('filterUpdate', { name, newFilters: filtersEnabled });
    }
</script>

<div class="dropdown {$$props.class}">
    <div
        tabindex="0"
        role="button"
        class="focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
    >
        Filter by {name}
        <div class="ml-2 h-4 w-4">{@html arrowDown}</div>
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
        <div class="divider my-1" />
        <ol class="text-sm space-y-2 max-h-64 pr-1 overflow-y-scroll">
            {#each filterList as filter, i (`${filter}_${filterSearch}`)}
                <li class="flex flex-row items-center {checkFilterSearch(filter)}">
                    <input
                        id="chk_{filter}"
                        type="checkbox"
                        class="w-1/6 h-4 rounded"
                        bind:checked={checkedFilters[i]}
                        on:change={handleFilterUpdate}
                    />
                    <!-- Allow this here as the label would just close the dropdown menu -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <label
                        for="chk_{filter}"
                        class="w-5/6 px-1 py-1 text-sm font-medium"
                        on:mousedown|preventDefault={() => {}}
                        on:keydown|preventDefault={() => {}}
                    >
                        {filter}
                    </label>
                </li>
            {/each}
        </ol>
    </div>
</div>
