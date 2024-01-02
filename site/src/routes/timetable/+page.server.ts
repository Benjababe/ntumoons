import modules_2023_1 from '$lib/data/modulesBasic_2023_1.json';
import modules_2023_2 from '$lib/data/modulesBasic_2023_2.json';
import type { ModulesBasic } from '$lib/types/Data';

export async function load() {
    return {
        modules: {
            '2023;1': modules_2023_1,
            '2023;2': modules_2023_2
        } as Record<string, ModulesBasic>
    };
}
