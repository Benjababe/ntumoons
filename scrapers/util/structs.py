import urllib
from dataclasses import asdict, dataclass
from typing import Type


@dataclass
class Dictable:
    def to_dict(self):
        return asdict(self)


@dataclass
class Staff(Dictable):
    title: str
    email: str
    tag: str
    url: str
    personal_url: str
    profile_pic_url: str
    description: str
    biography: str
    appointments: str
    interests: list[str]
    keywords: list[str]
    research_interests: list[str]
    current_grants: list[str]

    def __post_init__(self):
        self.url = urllib.parse.quote(self.url, safe=":/?=&")
        self.profile_pic_url = urllib.parse.quote(self.profile_pic_url, safe=":/?=&")


@dataclass
class CourseCategory(Dictable):
    code: str
    name: str
    modules: Type["list[Module]"]


@dataclass
class Lesson(Dictable):
    index: str
    module_code: str
    type: str
    group: str
    day: str
    time: str
    start_time: int
    end_time: int
    venue_name: str
    remark: str

    def __hash__(self):
        return hash(
            (
                self.index,
                self.module_code,
                self.group,
                self.venue_name,
                self.day,
                self.time,
                self.start_time,
                self.end_time,
            )
        )

    def __eq__(self, other):
        if not isinstance(other, type(self)):
            return NotImplemented
        return (
            self.index == other.index
            and self.module_code == other.module_code
            and self.group == other.group
            and self.venue_name == other.venue_name
            and self.day == other.day
            and self.time == other.time
            and self.start_time == other.start_time
            and self.end_time == other.end_time
        )


@dataclass
class Venue(Dictable):
    name: str
    lat: float
    lng: float
    floor: int
    lessons: list[Lesson]


@dataclass
class Exam(Dictable):
    module_code: str
    date: str
    time: str
    day: str
    duration: str
    iso_date: str
    hr_time: str


@dataclass
class CourseInfo(Dictable):
    code: str
    name: str


@dataclass
class Module(Dictable):
    verified: bool
    semester: str
    year: str
    semester_num: str
    code: str
    courses_offered: list[CourseInfo]
    credits: str
    description: str
    grading: str
    prerequisites: list[str]
    mutex: list[str]
    name: str
    name_pretty: str
    index_numbers: dict[str, list[Lesson]]
    exam: Exam


@dataclass
class CourseCategory(Dictable):
    code: str
    name: str
    name_pretty: str
    modules: list[Module]
