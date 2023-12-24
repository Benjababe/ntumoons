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
    <h2 class="text-xl font-medium">{$t('Modules.Mutex')}</h2>
    <div class="divider my-0" />
    <div class="flex flex-wrap gap-4 mt-2">
        {#each mutex as moduleCode}
            <button
                class="btn py-1 px-3"
                on:click|preventDefault={() => openModule(moduleCode)}
            >
                {moduleCode}
            </button>
        {/each}
    </div>
</div>
