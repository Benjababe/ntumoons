import { submitVenueLocation } from '$lib/search/firebase/venue.js';
import type { VenueSubmission } from '$lib/types/Venue';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { name, floor, comments, lat, lng } = (await request.json()) as VenueSubmission;
    const err = await submitVenueLocation(name, floor, comments, lat, lng);
    return json({ status: err ? 400 : 200 });
}
