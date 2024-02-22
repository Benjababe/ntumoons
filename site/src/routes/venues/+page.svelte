<script lang="ts">
    import VenueGrid from './VenueGrid.svelte';
    import VenueInfo from './VenueInfo.svelte';
    export let data;
    let activeVenueName = '';

    function activeVenueChange(e: CustomEvent<string>) {
        activeVenueName = e.detail;
    }
</script>

<div class="flex">
    <div class="h-[calc(100vh-17rem)] w-1/3 pr-2">
        <VenueGrid
            allVenues={data.venues}
            on:venue={activeVenueChange}
        />
    </div>
    <div class="divider divider-horizontal" />
    <div class="min-w-[800px]">
        <VenueInfo {activeVenueName} />
    </div>
</div>
