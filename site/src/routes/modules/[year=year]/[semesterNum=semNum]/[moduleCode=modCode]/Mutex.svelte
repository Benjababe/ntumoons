<script lang="ts">
    import { t } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';

    export let mutex: string[];
    const dispatch = createEventDispatcher<{ moduleStr: string }>();

    function openModule(moduleStr: string) {
        dispatch('moduleStr', moduleStr);
    }
</script>

<div>
    <h2 class="text-xl font-medium">{$t('Modules.Details.Mutex')}</h2>
    <div class="my-0 divider" />
    <div class="flex flex-wrap gap-4 mt-2">
        {#each mutex as moduleCode}
            <button
                class="px-3 py-1 capitalize btn"
                on:click|preventDefault={() => openModule(moduleCode)}
            >
                {moduleCode}
            </button>
        {/each}
    </div>
</div>
