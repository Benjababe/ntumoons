import venuesBasic from '$lib/data/venuesBasic.json';

export function load() {
    venuesBasic.sort();
    return { venues: venuesBasic.map((v) => v.trim()) };
}
