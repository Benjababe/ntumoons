type ModulesBasic = Array<{
    name_pretty: string;
    code: string;
}>;

type Module = {
    code: string;
    name: string;
    name_pretty: string;
    credits: string;
    exam: Exam;
    prerequisites: string[];
    course_codes: string[];
    verified: boolean;
    description: string;
    mutex: string[];
    semester: string;
    grading: string;
    index_numbers: { [key: number]: Lesson[] };
    active_index_number: string;
};

type Exam = {
    module_code: string;
    duration: string;
    date: string;
    day: string;
    time: string;
    iso_date: string;
    hr_time: string;
};

type Lesson = {
    module_code: string;
    index: string;
    remark: string;
    group: string;
    time: string;
    start_time: number;
    end_time: number;
    day: string;
    type: string;
    venue_name: string;
};

type Semester = {
    id: string;
    active: boolean;
    title: string;
};
