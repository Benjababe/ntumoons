<script lang="ts">
    import L, { LatLng, type LatLngExpression } from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

    export const markers: LatLngExpression[] = [];

    const dispatch = createEventDispatcher();

    const initialView: LatLngExpression = [1.346084, 103.680854];
    let mapElement: HTMLDivElement;

    let map: L.Map | undefined;

    onMount(() => {
        map = L.map(mapElement)
            .on('zoom', (e) => dispatch('zoom', e))
            .on('popupopen', async (e) => {
                await tick();
                e.popup.update();
            });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`
        }).addTo(map);
    });

    onDestroy(() => {
        map?.remove();
        map = undefined;
    });

    setContext('map', {
        getMap: () => map
    });

    $: if (map) {
        map.setView(initialView, 18);
    }
</script>

<div
    class="w-full h-full"
    bind:this={mapElement}
>
    {#if map !== undefined}
        <slot />
    {/if}
</div>
