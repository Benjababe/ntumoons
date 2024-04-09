<script lang="ts">
    import type { Theme } from '$lib/types/Settings';
    import L, { Marker, type LatLngExpression, type LeafletMouseEvent } from 'leaflet';
    import { GestureHandling } from 'leaflet-gesture-handling';
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
    import 'leaflet/dist/leaflet.css';
    import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
    import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
    import { markerIcon } from '../map/icons';

    export let ctrlScroll: boolean = false;
    export let initView: LatLngExpression = [1.346084, 103.680854];
    export let markers: LatLngExpression[] = [];
    export let allowUserMarker: boolean = false;
    export let userMarker: Marker | undefined = undefined;

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

    function setUserMarker(e: LeafletMouseEvent) {
        if (!map || !allowUserMarker) return;
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(e.latlng, { draggable: true }).addTo(map);
    }

    onMount(() => {
        const mapOptions = ctrlScroll ? { gestureHandling: true } : {};

        // Cast to any because TypeScript doesn't play well with `gestureHandling`
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        map = L.map(mapElement, <any>mapOptions)
            .on('zoom', (e) => dispatch('zoom', e))
            .on('popupopen', async (e) => {
                await tick();
                e.popup.update();
            });

        map.on('click', setUserMarker);

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
    class="w-full h-full rounded-lg"
    bind:this={mapElement}
>
    {#if map !== undefined}
        <slot />
    {/if}
</div>
