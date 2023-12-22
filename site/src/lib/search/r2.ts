import {
    SECRET_R2_ENDPOINT,
    SECRET_R2_ACCESS_KEY_ID,
    SECRET_R2_SECRET_ACCESS_KEY,
    SECRET_R2_REGION_NAME
} from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
    region: SECRET_R2_REGION_NAME,
    endpoint: SECRET_R2_ENDPOINT,
    credentials: {
        accessKeyId: SECRET_R2_ACCESS_KEY_ID || '',
        secretAccessKey: SECRET_R2_SECRET_ACCESS_KEY || ''
    }
});
