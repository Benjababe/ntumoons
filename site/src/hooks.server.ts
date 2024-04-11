import { SECRET_ADMIN_KEY, KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const rl = new Ratelimit({
    redis: new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN }),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: '@upstash/ratelimit'
});

export const handle = async ({ event, resolve }) => {
    const reqPath = event.url.pathname;

    if (reqPath.startsWith('/admin')) {
        const { success } = await rl.limit(event.getClientAddress());
        if (!success) return error(429, { message: 'Too many requests being sent recently' });

        if (event.url.searchParams.get('token') !== SECRET_ADMIN_KEY)
            return error(403, { message: 'You are unauthorised to access this page' });
    }

    return await resolve(event);
};
