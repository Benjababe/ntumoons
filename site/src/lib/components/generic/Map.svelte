<script lang="ts">
    import type { Theme } from '$lib/types/Settings';
    import L, { type LatLngExpression } from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
    import { markerIcon } from '../map/icons';

    export let initView: LatLngExpression = [1.346084, 103.680854];
    export let markers: LatLngExpression[] = [];

    const dispatch = createEventDispatcher();

    const tileSources = {
        light: 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
        dark: 'https://www.onemap.gov.sg/maps/tiles/Night/{z}/{x}/{y}.png'
    };

    let mapElement: HTMLDivElement;

    const sw = L.latLng(1.144, 103.535);
    const ne = L.latLng(1.494, 104.502);
    const bounds = L.latLngBounds(sw, ne);

    let map: L.Map | undefined;

    onMount(() => {
        map = L.map(mapElement)
            .on('zoom', (e) => dispatch('zoom', e))
            .on('popupopen', async (e) => {
                await tick();
                e.popup.update();
            });

        map.attributionControl.setPrefix('');
        map.setMaxBounds(bounds);

        L.tileLayer(tileSources[(localStorage.theme as Theme) ?? 'dark'], {
            detectRetina: true,
            minZoom: 17,
            maxZoom: 19,
            attribution:
                '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
        }).addTo(map);

        markers.forEach((marker) => {
            if (map) new L.Marker(marker, { icon: markerIcon }).addTo(map);
        });

        map.setView(initView, 18);
    });

    onDestroy(() => {
        map?.remove();
        map = undefined;
    });
</script>

<div
    class="w-full h-full"
    bind:this={mapElement}
>
    {#if map !== undefined}
        <slot />
    {/if}
</div>
