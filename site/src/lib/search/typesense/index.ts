import {
    SECRET_TYPESENSE_HOST,
    SECRET_TYPESENSE_PORT,
    SECRET_TYPESENSE_PROTOCOL,
    SECRET_TYPESENSE_API_KEY
} from '$env/static/private';
import Typesense from 'typesense';

export const typesense = new Typesense.Client({
    nodes: [
        {
            host: SECRET_TYPESENSE_HOST,
            port: parseInt(SECRET_TYPESENSE_PORT),
            protocol: SECRET_TYPESENSE_PROTOCOL
        }
    ],
    apiKey: SECRET_TYPESENSE_API_KEY
});

export const COLL_MODULES = 'modules';
export const COLL_STAFF = 'staff';

export { searchModules } from './module';
export { searchStaff } from './staff';
