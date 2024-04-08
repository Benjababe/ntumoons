import { getVenueSubmissions } from '$lib/search/firebase/venue.js';
import { json } from '@sveltejs/kit';

export async function GET() {
    const submissions = await getVenueSubmissions();
    return json(submissions);
}
