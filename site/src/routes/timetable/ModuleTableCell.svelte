<script lang="ts">
    import Cross from '$lib/assets/images/Cross.svelte';
    import { semester } from '$lib/stores';
    import { t } from '$lib/translations';
    import type { DispatchRemoveModule, DispatchUpdateIndex } from '$lib/types/Dispatch';
    import type { Module } from '$lib/types/Firebase';
    import { createEventDispatcher } from 'svelte';

    export let mod: Module;
    let activeIndexNumber = mod.active_index_number;

    const dispatch = createEventDispatcher<{
        remove: DispatchRemoveModule;
        updateIndex: DispatchUpdateIndex;
    }>();

    function remove() {
        dispatch('remove', { code: mod.code });
    }

    function updateIndex() {
        dispatch('updateIndex', { code: mod.code, index: activeIndexNumber });
    }
</script>

<div>
    <div class="float-right h-fit mt-1 ml-4 mr-4">
        <button
            class="btn-outline rounded-full w-max h-max p-1"
            on:click|preventDefault={remove}
        >
            <Cross />
        </button>
    </div>
    <a
        href="/modules/{$semester.year}/{$semester.semester_num}/{mod.code}"
        class="capitalize text-primary"
    >
        {mod.code}
        {mod.name_pretty}
    </a>
    <div class="text-sm">
        {#if mod.exam !== null}
            <span>
                Exam:
                {mod.exam.date}
                {mod.exam.time}
            </span>
        {:else}
            <span>{$t('Timetable.No exam for this module.')}</span>
        {/if}
        <span>-- {mod.credits} AU</span>
    </div>
    <div class="text-sm mt-2">
        <span>Index Number: </span>
        <select
            class="ml-2 rounded-sm bg-base-300"
            bind:value={activeIndexNumber}
            on:change={updateIndex}
        >
            <option value="-1">-Select one-</option>
            {#each Object.keys(mod.index_numbers) as idx}
                <option value={idx}>{idx}</option>
            {/each}
        </select>
    </div>
</div>
