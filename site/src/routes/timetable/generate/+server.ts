import { json } from '@sveltejs/kit';
import { generateTimetable } from './helper';
import type { Module } from '$lib/types/Firebase';

export async function POST({ request }) {
    const reqJson = await request.json();
    const modules = reqJson.modules as Module[];
    const { generatedPlans, planLimit, iterLimit } = await generateTimetable(modules);
    return json({ generatedPlans, planLimit, iterLimit });
}
