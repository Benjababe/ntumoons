import { SECRET_ADMIN_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
// import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

// const rl = new RetryAfterRateLimiter({
//     IP: [20, 'h'],
//     IPUA: [10, 'm']
// });

export const handle = async ({ event, resolve }) => {
    // const status = await rl.check(event);
    // if (status.limited) {
    //     const response = new Response(
    //         `You are being rate limited. Please try after ${status.retryAfter} seconds.`,
    //         {
    //             status: 429,
    //             headers: { 'Retry-After': status.retryAfter.toString() }
    //         }
    //     );
    //     return response;
    // }

    const reqPath = event.url.pathname;

    if (reqPath.startsWith('/admin') && event.url.searchParams.get('token') !== SECRET_ADMIN_KEY)
        return error(403, { message: 'You are unauthorised to access this page' });

    return await resolve(event);
};
