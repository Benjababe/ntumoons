import { getSemesters } from '$lib/search/firebase';
import { json } from '@sveltejs/kit';

export async function GET() {
    const semesters = await getSemesters();
    return json(semesters);
}
