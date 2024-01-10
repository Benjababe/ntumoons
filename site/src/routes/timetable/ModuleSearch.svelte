<script lang="ts">
    import Spinner from '$lib/components/generic/Spinner.svelte';
    import { activeSemester, timetableModules } from '$lib/stores';
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
                !$timetableModules[$activeSemester.id].some((tm) => tm.mutex.includes(mod.code)) &&
                !$timetableModules[$activeSemester.id].some((tm) => tm.code === mod.code) &&
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
            $timetableModules[$activeSemester.id] = [
                ...$timetableModules[$activeSemester.id],
                newModule
            ];
        } else {
            console.error(`Failed to retrieve module ${moduleCode}`);
        }

        searching = false;
    }

    async function fetchModule(moduleCode: string) {
        if ($timetableModules[$activeSemester.id].some((tm) => tm.code === moduleCode)) return -1;

        const res = await fetch('/search/firebase/module', {
            method: 'POST',
            body: JSON.stringify({ code: moduleCode, semesterId: $activeSemester.id })
        });

        if (!res.ok) return -1;

        try {
            const { mod } = (await res.json()) as { mod: Module };
            mod.active_index_number = '-1';
            return mod;
        } catch (ex) {
            return -1;
        }
    }
</script>

<div class="relative">
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
