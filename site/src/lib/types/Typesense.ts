/** Contains types for Typesense query & documents */

export type CollectionNames = 'modules' | 'staff';

export type Filter = { name: string; count: number; enabled: boolean };
export type FilterMap = Record<string, Filter[]>;

export type ModuleDoc = {
    code: string;
    description: string;
    id: string;
    name: string;
    name_pretty: string;
    year: string;
    semester_num: string;
};

export type StaffDoc = {
    email: string;
    title: string;
    description: string;
    keywords: string[];
    profile_pic_url: string;
    appointments: string[];
    tag: string;
};

export type Docs = StaffDoc | ModuleDoc;
