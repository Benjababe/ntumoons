<script lang="ts">
    import { t } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';

    export let prerequisitesArr: string[];
    const dispatch = createEventDispatcher<{ moduleStr: string }>();

    function openModule(moduleStr: string) {
        dispatch('moduleStr', moduleStr);
    }
</script>

<div>
    <h2 class="text-xl font-medium">{$t('Modules.Details.Prerequisites')}</h2>
    <div class="my-0 divider" />
    <div class="flex flex-wrap gap-4 mt-2">
        {#each prerequisitesArr as prerequisites}
            <div class="flex items-center justify-center p-2 rounded-md bg-neutral w-max">
                {#each prerequisites.split(' & ') as moduleCode, i}
                    <button
                        class="px-2 py-1 capitalize btn"
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
