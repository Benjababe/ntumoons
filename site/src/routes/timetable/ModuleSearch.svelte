<script lang="ts">
    import Spinner from '$lib/components/generic/Spinner.svelte';
    import { semester, timetableModules } from '$lib/stores';
    import { t } from '$lib/translations';
    import type { ModulesBasic } from '$lib/types/Data';
    import type { Module } from '$lib/types/Firebase';

    export let modules: ModulesBasic = [];
    let moduleResults: ModulesBasic = [];
    let searchHidden = false;
    let searchValue = '';
    let searching = false;

    function handleSearch() {
        moduleResults = modules.filter((mod) => {
            return (
                !$timetableModules.some((tm) => tm.mutex.includes(mod.code)) &&
                !$timetableModules.some((tm) => tm.code === mod.code) &&
                (mod.code.toUpperCase().includes(searchValue.toUpperCase()) ||
                    mod.name_pretty.toUpperCase().includes(searchValue.toUpperCase()))
            );
        });
    }

    async function addModuleTimetable(moduleCode: string) {
        searchValue = '';
        searching = true;
        const newModule = await fetchModule(moduleCode);

        if (newModule !== -1) {
            $timetableModules = [...$timetableModules, newModule];
        } else {
            console.error(`Failed to retrieve module ${moduleCode}`);
        }

        searching = false;
    }

    async function fetchModule(moduleCode: string) {
        if ($timetableModules.some((tm) => tm.code === moduleCode)) return -1;

        const res = await fetch('/search/firebase/module', {
            method: 'POST',
            body: JSON.stringify({ code: moduleCode, semesterId: $semester.id })
        });

        if (!res.ok) return -1;

        const mod: Module = await res.json();
        mod.active_index_number = '-1';
        return mod;
    }
</script>

<div class="relative mb-4">
    <input
        type="text"
        placeholder={$t('Timetable.Course code or name')}
        class="input input-bordered w-full h-10"
        disabled={searching}
        bind:value={searchValue}
        on:input={handleSearch}
        on:focus={() => (searchHidden = false)}
        on:blur={() => (searchHidden = true)}
    />
    {#if searching}
        <div class="w-full flex justify-center">
            <Spinner />
        </div>
    {/if}
    {#if moduleResults.length > 0 && !searchHidden && searchValue.length > 0}
        <ol
            class="absolute w-full max-h-48 top-11 border border-neutral border-opacity-50 overflow-y-scroll rounded-sm z-10"
        >
            {#each moduleResults as mod}
                <li class="hover:text-primary bg-base-100 hover:bg-base-300">
                    <button
                        class="px-4 py-2 w-full text-left capitalize cursor-pointer"
                        on:mousedown|preventDefault|once={() => addModuleTimetable(mod.code)}
                        on:keydown|preventDefault|once={() => addModuleTimetable(mod.code)}
                    >
                        {`${mod.code} ${mod.name_pretty}`}
                    </button>
                </li>
            {/each}
        </ol>
    {/if}
</div>
