import { r2 } from '$lib/search/r2';
import { defaultSemester } from '$lib/stores/semester';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';

export async function GET() {
    const command = new GetObjectCommand({
        Bucket: 'semester',
        Key: 'active-semester'
    });
    const res = await r2.send(command);
    const str = await res.Body?.transformToString();

    if (str == undefined) return json(defaultSemester);
    else return json(JSON.parse(str));
}
