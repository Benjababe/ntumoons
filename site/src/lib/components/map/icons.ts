import { Icon } from 'leaflet';
import Marker from '$lib/assets/images/map-marker.svg';

export const markerIcon = new Icon({
    iconUrl: Marker,
    iconSize: [38, 95]
});
