<script lang="ts">
    import { t } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';

    export let prerequisitesArr: string[];
    const dispatch = createEventDispatcher<{ moduleStr: string }>();

    function openModule(moduleStr: string) {
        dispatch('moduleStr', moduleStr);
    }
</script>

<div class="mt-6">
    <h2 class="text-xl font-medium">{$t('Modules.Prerequisites')}</h2>
    <div class="divider my-0" />
    <div class="flex flex-wrap gap-4 mt-2">
        {#each prerequisitesArr as prerequisites}
            <div class="flex justify-center items-center bg-neutral-content rounded-md p-2 w-max">
                {#each prerequisites.split(' & ') as moduleCode, i}
                    <button
                        class="btn py-1 px-2"
                        on:click|preventDefault={() => openModule(moduleCode)}
                    >
                        {moduleCode}
                    </button>
                    {#if i < prerequisites.split(' & ').length - 1}
                        <span class="px-1 text-black">&</span>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
