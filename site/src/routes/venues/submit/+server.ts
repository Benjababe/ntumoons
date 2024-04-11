import { submitVenueLocation } from '$lib/api/firebase/venue';
import type { VenueSubmissionReq } from '$lib/types/Venue';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { venue, floor, comments, lat, lng } = (await request.json()) as VenueSubmissionReq;
    const err = await submitVenueLocation(venue, floor, comments, lat, lng);
    return json({ status: err ? 400 : 200 });
}
