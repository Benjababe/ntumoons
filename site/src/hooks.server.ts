export const handle = async ({ event, resolve }) => {
    // TODO: Handle auth
    // const reqPath = event.url.pathname;

    // if (reqPath.startsWith('/admin')) return new Response('Unauthorised', { status: 403 });

    return resolve(event);
};
