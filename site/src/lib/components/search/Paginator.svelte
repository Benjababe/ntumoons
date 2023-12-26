<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const DOUBLE_LEFT = '«';
    const DOUBLE_RIGHT = '»';
    const dispatch = createEventDispatcher<{ pageChange: number }>();

    export let pages: number[];
    export let activePage: number;
</script>

{#if pages.length > 0}
    <div class="join mt-8">
        {#if activePage > 1}
            <button
                class="join-item btn btn-md"
                on:click|preventDefault={() => dispatch('pageChange', 1)}
            >
                {DOUBLE_LEFT}
            </button>
        {/if}
        {#each pages as pageNum}
            <button
                class="join-item btn btn-md {pageNum === activePage ? 'btn-active' : ''}"
                on:click|preventDefault={() => dispatch('pageChange', pageNum)}
            >
                {pageNum}
            </button>
        {/each}
        {#if activePage !== pages[pages.length - 1]}
            <button
                class="join-item btn btn-md"
                on:click|preventDefault={() => dispatch('pageChange', -1)}
            >
                {DOUBLE_RIGHT}
            </button>
        {/if}
    </div>
{/if}
