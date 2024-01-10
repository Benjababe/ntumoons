/** Contains types used in custom dispatches */

import type { Filter } from './Typesense';

export type DispatchRemoveModule = {
    code: string;
};

export type DispatchUpdateIndex = {
    code: string;
    index: string;
};

export type DispatchFilterUpdate = {
    name: string;
    newFilters: Filter[];
};
