/** Contains types for Firebase documents */

import type { Day } from './Timetable';

export type Module = {
    code: string;
    name: string;
    name_pretty: string;
    credits: string;
    exam: Exam;
    prerequisites: string[];
    courses_offered: { code: string; name: string }[];
    verified: boolean;
    description: string;
    mutex: string[];
    semester: string;
    grading: string;
    index_numbers: { [key: string]: Lesson[] };
    active_index_number: string;
};

export type Exam = {
    module_code: string;
    duration: string;
    date: string;
    day: string;
    time: string;
    iso_date: string;
    hr_time: string;
};

export type Lesson = {
    module_code: string;
    index: string;
    remark: string;
    group: string;
    time: string;
    start_time: number;
    end_time: number;
    day: Day;
    type: string;
    venue_name: string;
};

export type Staff = {
    title: string;
    email: string;
    tag: string;
    url: string;
    personal_url: string;
    profile_pic_url: string;
    description: string;
    biography: string;
    appointments: string;
    interests: string[];
    keywords: string[];
    research_interests: string[];
    current_grants: string[];
};

export type Semester = {
    default: boolean;
    id: string;
    active: boolean;
    title: string;
    year: string;
    semester_num: string;
};
