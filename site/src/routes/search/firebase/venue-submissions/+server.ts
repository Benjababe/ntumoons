import { getVenueSubmissions, updateVenueSubmission } from '$lib/search/firebase/venue.js';
import type { VenueSubmissionUpdate } from '$lib/types/Venue.js';
import { error, json } from '@sveltejs/kit';

export async function GET() {
    const submissions = await getVenueSubmissions();
    return json(submissions);
}

export async function POST({ request }) {
    const data = (await request.json()) as VenueSubmissionUpdate;
    const res = await updateVenueSubmission(data);
    return res ? json({}) : error(400, 'Could not update submission');
}
