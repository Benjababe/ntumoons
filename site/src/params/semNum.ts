import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return /^[1|2]$/.test(param);
};
