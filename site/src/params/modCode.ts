import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return /^[\d\D]{6}$/.test(param);
};
