import argparse
import asyncio
import platform

import requests
from requests.adapters import HTTPAdapter, Retry

from data.firestore import write_fs, write_fs_list
from data.json import write_json, write_json_invidivual, write_json_list
from ntu.course_module import get_course_categories, scrape_category_modules
from ntu.exam import get_exam_plan_num, insert_module_exams
from ntu.staff import get_all_staff, get_metadata
from util.helper import get_sem_title, merge_venue
from util.typesense import init_typesense, typesense_upsert

FS_COLL_SEM = "semester"
FS_COLL_MODULE = "modules"
FS_COLL_COURSE_CATEGORY = "courseCategories"
FS_COLL_VENUE = "venues"
FS_COLL_STAFF = "staff"

TS_COLL_MODULE = "modules"
TS_COLL_STAFF = "staff"

TS_ATTRS_MODULE = [
    "name",
    "name_pretty",
    "code",
    "description",
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
    modules = insert_module_exams(sess, semester, exam_plan_num, modules)

    write_json_invidivual(modules, f"{semester}/modules", "code")
    write_json_list(
        modules, f"{semester}/modulesBasic", ["name_pretty", "code"], "code"
    )
    write_json_list(categories, f"{semester}/courseCategories")
    write_json_list(venues, f"{semester}/venues")
    write_json([venue.name for venue in venues], f"{semester}/venuesBasic")

    semester_prepend = f"{semester}_"

    typesense_upsert(TS_COLL_MODULE, "code", modules, TS_ATTRS_MODULE)

    sem_obj = {
        "active": True,
        "id": semester,
        "title": get_sem_title(semester, True),
        "year": semester.split(";")[0],
        "semester_num": semester.split(";")[1],
    }
    await write_fs(FS_COLL_SEM, semester, sem_obj)
    await write_fs_list(
        FS_COLL_MODULE, "code", modules, doc_id_prepend=semester_prepend
    )
    await write_fs_list(
        FS_COLL_COURSE_CATEGORY, "code", categories, doc_id_prepend=semester_prepend
    )
    await write_fs_list(
        FS_COLL_VENUE, "name", venues, override=False, override_func=merge_venue
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
    await scrape_staff()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Scrape modules for a specific semester."
    )
    parser.add_argument(
        "-s",
        "--semester",
        metavar="semester",
        type=str,
        help="Semester in YYYY;S format.",
        nargs="?",
        default="",
    )
    args = parser.parse_args()
    semester = args.semester

    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    init_typesense()

    asyncio.run(scrape(semester))
