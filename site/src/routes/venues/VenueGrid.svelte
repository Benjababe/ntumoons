<script lang="ts">
    import { t } from '$lib/translations';
    import { type DispatchActiveVenue } from '$lib/types/Dispatch';
    import { createEventDispatcher } from 'svelte';

    export let allVenues: string[] = [];

    const dispatch = createEventDispatcher<DispatchActiveVenue>();
    let venueFilter = '';

    $: venues = allVenues.filter((v) => {
        const vf = venueFilter.toLowerCase().trim();
        return venueFilter.length > 0 ? v.toLowerCase().includes(vf) : true;
    });

    function setActiveVenue(venue: string) {
        dispatch('venue', venue);
    }
</script>

<input
    type="text"
    class="w-full input input-bordered"
    placeholder={$t('Venues.Enter venue name')}
    bind:value={venueFilter}
/>
<div class="grid grid-cols-3 gap-2 mt-4">
    {#each venues as venue}
        <button
            class="btn btn-primary"
            on:click|preventDefault={() => setActiveVenue(venue)}
        >
            {venue}
        </button>
    {/each}
</div>
