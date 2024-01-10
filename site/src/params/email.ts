import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return /^.+@ntu\.edu\.sg$/.test(param);
};
