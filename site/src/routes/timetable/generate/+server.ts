import { json } from '@sveltejs/kit';
import { generateTimetable } from './helper';
import type { GenerateRequestParams } from '$lib/types/Timetable';

export async function POST({ request }) {
    const { modules, dayFiltersStr } = (await request.json()) as GenerateRequestParams;
    const { generatedPlans, planLimit, iterLimit } = await generateTimetable(
        modules,
        dayFiltersStr
    );
    return json({ generatedPlans, planLimit, iterLimit });
}
