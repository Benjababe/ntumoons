import { getVenueLessons } from '$lib/search/firebase';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { venue, semesterId } = await request.json();
    const lessons = await getVenueLessons(venue, semesterId);
    return json(lessons);
}
