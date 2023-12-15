import datetime
import json
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
    appointments: list[str]
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


@dataclass
class Module(Dictable):
    verified: bool
    code: str
    course_codes: list[str]
    credits: str
    description: str
    grading: str
    prerequisites: list[list[str]]
    mutex: list[str]
    name: str
    index_numbers: dict[str, list[Lesson]]
    exam: Exam

    def to_dict(self):
        self.prerequisites = json.dumps(self.prerequisites, separators=(",", ":"))
        return super().to_dict()


@dataclass
class CourseCategory(Dictable):
    code: str
    name: str
    modules: list[Module]
