import { getModuleDoc, getSemesterTitle } from '$lib/search/firebase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { moduleCode, year, semesterNum } = params;
    const semesterTitle = getSemesterTitle(year, semesterNum);

    // First we try to get the module for the semester provided
    let module = await getModuleDoc(moduleCode, semesterNum, year);

    // If not found, try again but without a semester constraint
    if (module === undefined) {
        module = await getModuleDoc(moduleCode);

        // If totally not found, return 404 error
        if (module === undefined) error(404, { message: `Module "${moduleCode}" not found!` });
        else return { year, semesterNum, module, semesterTitle, currentSemester: false };
    }

    // If found, sweet
    else return { year, semesterNum, module, semesterTitle, currentSemester: true };
}
