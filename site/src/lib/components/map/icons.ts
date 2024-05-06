import Marker from '$lib/assets/images/map-marker.svg';
import { Icon } from 'leaflet';

export const markerIcon = new Icon({
    iconUrl: Marker,
    iconSize: [38, 95],
    iconAnchor: [18, 62]
});
