import { SECRET_ADMIN_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    const reqPath = event.url.pathname;

    if (reqPath.startsWith('/admin') && event.url.searchParams.get('token') !== SECRET_ADMIN_KEY)
        return error(403, { message: 'You are unauthorised to access this page' });

    return await resolve(event);
};
