<script lang="ts">
    import { t } from '$lib/translations';
    import modules from '$lib/modules/modulesBasic.json';
    import type { ModulesBasic } from '$lib/modules/types';

    let moduleResults: ModulesBasic = [];
    let searchFocused = false;
    let searchValue = '';

    function handleSearch() {
        moduleResults = modules.filter((mod) => {
            return (
                mod.code.toUpperCase().includes(searchValue.toUpperCase()) ||
                mod.name.toUpperCase().includes(searchValue.toUpperCase())
            );
        });
    }

    function addModuleTimetable() {
        searchValue = '';
    }
</script>

<div class="flex justify-center relative">
    <input
        type="text"
        placeholder={$t('Timetable.Course code or name')}
        class="input input-bordered w-full max-w-5xl h-10"
        bind:value={searchValue}
        on:input={handleSearch}
        on:focusin={() => (searchFocused = true)}
        on:focusout={() => (searchFocused = false)}
    />
    {#if moduleResults.length > 0 && searchFocused && searchValue.length > 0}
        <ol class="absolute w-full max-w-5xl max-h-48 top-11 overflow-y-scroll">
            {#each moduleResults as mod}
                <li class="hover:text-accent hover:bg-base-200">
                    <button
                        class="px-4 py-2 w-full text-left capitalize cursor-pointer"
                        on:click={addModuleTimetable}
                        on:keydown={addModuleTimetable}
                    >
                        {`${mod.code} ${mod.name.toLowerCase()}`}
                    </button>
                </li>
            {/each}
        </ol>
    {/if}
</div>
