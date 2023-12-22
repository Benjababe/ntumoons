import { r2 } from '$lib/search/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';

const KEY_ERR = 'The specified key does not exist.';
const READING_ERR = 'Module exists but there was an error with reading module';

export async function POST({ request }) {
    const { code, semesterId } = await request.json();
    let res;

    try {
        const command = new GetObjectCommand({
            Bucket: 'modules',
            Key: `${semesterId}/${code}`
        });
        res = await r2.send(command);
    } catch (err) {
        if ((err as Error).message == KEY_ERR)
            return new Response('Module code not found', { status: 404 });

        return new Response('Unexpected error occured', { status: 400 });
    }

    const str = await res.Body?.transformToString();

    if (str === undefined) return new Response(READING_ERR, { status: 400 });
    else return json(JSON.parse(str));
}
