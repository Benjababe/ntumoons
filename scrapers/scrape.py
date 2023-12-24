import asyncio
import platform

import requests
from requests.adapters import HTTPAdapter, Retry

from data.firestore import write_fs, write_fs_list
from data.json import write_json, write_json_invidivual
from ntu.course_module import (
    get_course_categories,
    get_sem_title,
    scrape_category_modules,
)
from ntu.exam import get_exam_plan_num, insert_module_exams
from ntu.staff import get_all_staff, get_keywords
from util.typesense import init_typesense, typesense_upsert

FS_COLL_SEM = "semester"
FS_COLL_MODULE = "modules"
FS_COLL_COURSE_CATEGORY = "courseCategories"
FS_COLL_VENUE = "venues"
FS_COLL_STAFF = "staff"

TS_COLL_MODULE = "modules"
TS_COLL_STAFF = "staff"

TS_ATTRS_MODULE = ["name", "name_pretty", "code", "semester", "description"]
TS_ATTRS_STAFF = ["title", "email", "description"]

retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
sess = requests.Session()
sess.mount("https://", HTTPAdapter(max_retries=retries))


async def scrape_modules():
    """
    Steps:
    - Gets all course categories from the class schedule page.
    - For each course category, get all modules offered, lessons and venues.
        - Retrieving module and venues uses the class schedule for lesson times.
        - And course content for module descriptions.

    - Uploads course categories, modules and venues onto firebase.
    """

    semester, categories = get_course_categories(sess)
    categories, modules, venues = scrape_category_modules(sess, semester, categories)
    exam_plan_num = get_exam_plan_num(sess)
    modules = insert_module_exams(sess, semester, exam_plan_num, modules)

    write_json_invidivual(modules, f"{semester}/modules", "code")
    write_json(modules, "modulesBasic", ["name_pretty", "code"], "code")
    write_json(categories, "courseCategories")
    write_json(venues, "venues")

    semester_prepend = f"{semester}_"

    typesense_upsert(TS_COLL_MODULE, "code", modules, TS_ATTRS_MODULE, semester_prepend)

    sem_obj = {"active": True, "id": semester, "title": get_sem_title(semester)}
    await write_fs(FS_COLL_SEM, semester, sem_obj)
    await write_fs_list(FS_COLL_MODULE, "code", modules, semester_prepend)
    await write_fs_list(FS_COLL_COURSE_CATEGORY, "code", categories, semester_prepend)
    await write_fs_list(FS_COLL_VENUE, "name", venues, override=False)


async def scrape_staff():
    """
    Scraping staff is pretty simple:

    - Goes through page 1 to go through faculty staff and retrieve total amount of pages.
        - For each page, retrieve commonly found information for each professor.

    - Use email as document id as it is expected not to change.
    - Upload everything to firebase.
    """

    staff_list = get_all_staff(sess)
    keywords = get_keywords(staff_list)

    write_json(staff_list, "staff")

    typesense_upsert(TS_COLL_STAFF, "email", staff_list, TS_ATTRS_STAFF)

    await write_fs(FS_COLL_STAFF, "metadata", {"keywords": keywords})
    await write_fs_list(FS_COLL_STAFF, "email", staff_list)


async def scrape():
    await scrape_modules()
    await scrape_staff()


if __name__ == "__main__":
    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    init_typesense()

    asyncio.run(scrape())
