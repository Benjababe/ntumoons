import argparse
import asyncio
import cProfile
import platform

import requests
from requests.adapters import HTTPAdapter, Retry

from data.firestore import init_firestore, write_fs, write_fs_list
from data.json import write_json, write_json_invidivual, write_json_list
from ntu.course_module import get_course_categories, scrape_category_modules
from ntu.exam import get_exam_plan_num, insert_module_exams
from ntu.staff import get_all_staff, get_metadata
from util.args import get_args
from util.helper import get_sem_title, merge_venue
from util.typesense import init_typesense, typesense_upsert

FS_COLL_SEM = "semester"
FS_COLL_MODULE = "modules"
FS_COLL_COURSE_CAT = "courseCategories"
FS_COLL_VENUE = "venues"
FS_COLL_STAFF = "staff"

TS_COLL_MODULE = "modules"
TS_COLL_STAFF = "staff"

TS_ATTRS_MODULE = [
    "name",
    "name_pretty",
    "code",
    "description",
    "verified",
]
TS_ATTRS_STAFF = [
    "title",
    "email",
    "description",
    "keywords",
    "profile_pic_url",
    "appointments",
    "tag",
]

retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
sess = requests.Session()
sess.mount("https://", HTTPAdapter(max_retries=retries))


async def scrape_modules(force_semester: str):
    """
    Steps:
    - Gets all course categories from the class schedule page.
    - For each course category, get all modules offered, lessons and venues.
        - Retrieving module and venues uses the class schedule for lesson times.
        - And course content for module descriptions.

    - Uploads course categories, modules and venues onto firebase.
    """

    semester, categories = get_course_categories(sess, force_semester)
    categories, modules, venues = scrape_category_modules(sess, semester, categories)
    exam_plan_num = get_exam_plan_num(sess, semester)
    if exam_plan_num is not None:
        modules = insert_module_exams(sess, semester, exam_plan_num, modules)

    write_json_invidivual(modules, f"{semester}/modules", "code")
    write_json_list(
        modules, f"{semester}/modulesBasic", ["name_pretty", "code"], "code"
    )
    write_json_list(categories, f"{semester}/courseCategories")
    write_json_list(venues, f"{semester}/venues")
    write_json([venue.name for venue in venues], f"{semester}/venuesBasic")

    # Only insert verified modules into Typesense
    # Unverfied modules usually don't have description or actual pretty names
    verified_modules = list(filter(lambda m: m.verified, modules))
    typesense_upsert(TS_COLL_MODULE, "code", verified_modules, TS_ATTRS_MODULE)

    sem_obj = {
        "active": False,
        "id": semester,
        "title": get_sem_title(semester, True),
        "year": semester.split(";")[0],
        "semester_num": semester.split(";")[1],
        "shown": True,
    }
    await write_fs(FS_COLL_SEM, semester, sem_obj)
    await write_fs_list(FS_COLL_MODULE, "code", modules, subcoll_key="semesters")
    await write_fs_list(FS_COLL_COURSE_CAT, "code", categories, subcoll_key="semesters")
    await write_fs_list(
        FS_COLL_VENUE,
        "name",
        venues,
        subcoll_key="semesters",
        overwrite=False,
        overwrite_func=merge_venue,
    )


async def scrape_staff():
    """
    Scraping staff is pretty simple:

    - Goes through page 1 to go through faculty staff and retrieve total amount of pages.
        - For each page, retrieve commonly found information for each professor.

    - Use email as document id as it is expected not to change.
    - Upload everything to firebase.
    """

    staff_list = get_all_staff(sess)
    metadata = get_metadata(staff_list)

    write_json_list(staff_list, "staff")
    write_json(metadata, "staffMetadata")

    typesense_upsert(TS_COLL_STAFF, "email", staff_list, TS_ATTRS_STAFF)

    await write_fs(FS_COLL_STAFF, "metadata", metadata)
    await write_fs_list(FS_COLL_STAFF, "email", staff_list)


async def scrape(force_semester: str):
    await scrape_modules(force_semester)
    # await scrape_staff()


if __name__ == "__main__":
    with cProfile.Profile() as pr:
        args = get_args()
        semester, environment = str(args.semester), str(args.environment)

        if platform.system() == "Windows":
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        init_firestore(environment.strip().title())
        init_typesense()

        asyncio.run(scrape(semester))

    pr.dump_stats("scrape.prof")
