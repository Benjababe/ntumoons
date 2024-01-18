<script lang="ts">
    import VenueGrid from './VenueGrid.svelte';
    import VenueInfo from './VenueInfo.svelte';
    export let data;
    let activeVenue = '';

    function activeVenueChange(e: CustomEvent<string>) {
        activeVenue = e.detail;
    }
</script>

<div class="flex">
    <div class="w-1/3">
        <VenueGrid
            allVenues={data.venues}
            on:venue={activeVenueChange}
        />
    </div>
    <div class="divider divider-horizontal" />
    <div class="w-2/3">
        <VenueInfo {activeVenue} />
    </div>
</div>
