<script lang="ts">
    import modules from '$lib/modules/modulesBasic.json';
    import type { ModulesBasic } from '$lib/modules/types';
    import { semester, timetableModules } from '$lib/store';
    import { t } from '$lib/translations';

    let moduleResults: ModulesBasic = [];
    let searchHidden = false;
    let searchValue = '';

    function handleSearch() {
        moduleResults = modules.filter((mod) => {
            return (
                !$timetableModules.some((tm) => tm.code === mod.code) &&
                (mod.code.toUpperCase().includes(searchValue.toUpperCase()) ||
                    mod.name_pretty.toUpperCase().includes(searchValue.toUpperCase()))
            );
        });
    }

    async function addModuleTimetable(moduleCode: string) {
        const newModule = await fetchModule(moduleCode);

        if (newModule !== -1) {
            $timetableModules = [...$timetableModules, newModule];
            localStorage.setItem('timetableModules', JSON.stringify($timetableModules));
        } else {
            console.error(`Failed to retrieve module ${moduleCode}`);
        }

        searchValue = '';
    }

    async function fetchModule(moduleCode: string) {
        if ($timetableModules.some((tm) => tm.code === moduleCode)) return -1;

        const res = await fetch('/search/firebase/module', {
            method: 'POST',
            body: JSON.stringify({ code: moduleCode, semesterId: $semester.id })
        });

        const mod: Module = await res.json();
        return mod;
    }
</script>

<div class="relative mb-4">
    <input
        type="text"
        placeholder={$t('Timetable.Course code or name')}
        class="input input-bordered w-full h-10"
        bind:value={searchValue}
        on:input={handleSearch}
        on:focus={() => (searchHidden = false)}
        on:blur={() => (searchHidden = true)}
    />
    {#if moduleResults.length > 0 && !searchHidden && searchValue.length > 0}
        <ol class="absolute w-full max-h-48 top-11 overflow-y-scroll z-10">
            {#each moduleResults as mod}
                <li class="hover:text-accent bg-base-100 hover:bg-base-300">
                    <button
                        class="px-4 py-2 w-full text-left capitalize cursor-pointer"
                        on:mousedown|preventDefault={() => addModuleTimetable(mod.code)}
                        on:keydown|preventDefault={() => addModuleTimetable(mod.code)}
                    >
                        {`${mod.code} ${mod.name_pretty}`}
                    </button>
                </li>
            {/each}
        </ol>
    {/if}
</div>
