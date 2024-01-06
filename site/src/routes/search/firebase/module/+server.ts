import { getModuleDoc, semesterIdToSemYear } from '$lib/search/firebase';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { code, semesterId } = await request.json();
    const { year, semesterNum } = semesterIdToSemYear(semesterId);
    const mod = await getModuleDoc(code, semesterNum, year);

    if (mod === undefined) return error(400);
    return json({ mod });
}
