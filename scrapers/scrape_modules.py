import asyncio
import re
import sys
from typing import cast

import bs4
import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter, Retry

from data import (
    write_fs_semester_modules,
    write_fs_semester_venue,
    write_json_course_categories,
    write_json_modules,
    write_json_venues,
)
from structs import CourseCategory, Lesson, Module, Venue
from util import (
    merge_dicts_sets,
    read_cache,
    session_get_cache,
    session_post_cache,
    write_cache,
)

CACHE_FILENAME = "modules"
SCHEDULE_SELECT_PAGE = "https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main"
COURSE_DETAIL_PAGE = "https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1"
COURSE_INFO_PAGE = "https://wis.ntu.edu.sg/webexe/owa/AUS_SUBJ_CONT.main_display1"

DEFAULT_LAT = 1.3464
DEFAULT_LNG = 103.6808

retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
sess = requests.Session()
sess.mount("https://", HTTPAdapter(max_retries=retries))


def get_course_categories(force_semester="") -> tuple[str, list[CourseCategory]]:
    """Returns all course categories for the current or given semester

    Args:
        force_semester (str, optional): Academic semester to filter, format "YYYY;S".
        Eg. "2022;2" for 2022 Sem 2 Defaults to "".

    Returns:
        tuple[str, list[CourseCategory]]: Semester string and list of course categories
    """
    res = session_get_cache(sess, SCHEDULE_SELECT_PAGE)
    soup = BeautifulSoup(res.text, "lxml")

    if force_semester == "":
        semester_selector = soup.find("select", {"name": "acadsem"})
        semester_selector = cast(bs4.element.Tag, semester_selector)

        active_semester = semester_selector.find("option", {"selected": True})
        active_semester = cast(bs4.element.Tag, active_semester)

        semester = active_semester["value"]
    else:
        semester = force_semester

    # gets the list of course selections
    course_selector = soup.find("select", {"name": "r_course_yr"})
    course_selector = cast(bs4.element.Tag, course_selector)

    # within the list, find all selectable categories
    categories = course_selector.find_all("option", {"value": True})

    # remove options with empty category values
    categories = list(filter(lambda c: c["value"] != "", categories))

    # only keep category value and name
    categories = list(
        map(
            lambda c: CourseCategory(code=c["value"], name=c.text.strip(), modules=[]),
            categories,
        )
    )

    return semester, categories


def scrape_category_modules(
    semester: str, categories: list[CourseCategory]
) -> tuple[list[Module], list[Venue]]:
    """Goes through all course categories and retrieve the module and venue information

    Args:
        semester (str): Semester in YYYY;S format
        categories (list[CourseCategory]): List of course categories
    """

    # skip scraping and html parsing if possible
    cache_key = f"{semester}_category_modules"
    cache = read_cache(CACHE_FILENAME, cache_key)
    if cache is not None:
        categories = cache["categories"]
        return cache["modules"], cache["venues"]

    category_modules: list[Module] = []
    added_codes = set()

    # just a dict, key=course code, value=set of lessons
    # will be converted to list of Venue objects at the end
    venue_dict: dict[str, set(Lesson)] = {}
    venues = []

    for i, category in enumerate(categories):
        category_name = category.name

        sys.stdout.write("\033[K")
        print(f"Scraping {category_name}", end="\r")

        # category code split into 4 parts split by ';'
        # <course code> ; <secondary code> ; <year of study> ; <part/full time>
        category_code = category.code
        category_codes = category.code.split(";")

        # part/full time is required in retrieving module info
        r_search_type = category_codes[-1]

        # retrieve all modules for the course category and their timeslots
        data = {
            "acadsem": semester,
            "r_course_yr": category.code,
            "r_subj_code": "",
            "r_search_type": r_search_type,
            "boption": "CLoad",
            "staff_access": "false",
        }
        res = session_post_cache(sess, COURSE_DETAIL_PAGE, data)

        if res.ok:
            modules, module_venues = get_category_modules_venues(res.text)
            venue_dict = merge_dicts_sets(venue_dict, module_venues)
        else:
            print(f"Error with scraping {category_name}")
            continue

        # retrieve module description & grading types
        data = {
            "acadsem": semester.replace(";", "_"),
            "r_course_yr": category.code,
            "r_subj_code": "",
            "boption": "CLoad",
            "acad": semester.split(";")[0],
            "semester": semester.split(";")[1],
        }
        res = session_post_cache(sess, COURSE_INFO_PAGE, data)

        if res.ok:
            modules = get_category_modules_info(modules, res.text)
        else:
            print(f"Error with scraping {category_name}")
            continue

        # add modules which have not already been added
        for module in modules:
            if not module.verified or module.code in added_codes:
                continue
            else:
                category_modules.append(module)
                added_codes.add(module.code)

        # add category code to module if this category offers it
        for j, module in enumerate(category_modules):
            if module.code in added_codes:
                category_modules[j].course_codes.append(category_code)

        # include module codes offered into category
        category.modules = list(map(lambda m: m.code, modules))
        categories[i] = category

    for v_name, lessons in venue_dict.items():
        venue = Venue(
            name=v_name,
            lat=DEFAULT_LAT,
            lng=DEFAULT_LNG,
            floor=-1,
            lessons=list(lessons),
        )
        venues.append(venue)

    # cache results in case of reuse
    cache_val = {
        "categories": categories,
        "modules": category_modules,
        "venues": venues,
    }
    write_cache(CACHE_FILENAME, cache_key, cache_val)

    return category_modules, venues


def get_category_modules_info(modules: list[Module], html: str) -> list[Module]:
    """Parses scraped module grading and description

    Args:
        module_codes (list[Module]): Modules for the current category
        html (str): HTTP response text

    Returns:
        list[Module]: Modules populated with additional information
    """

    module_codes = list(map(lambda m: m.code, modules))

    soup = BeautifulSoup(html, "lxml")
    module_tables = soup.find_all("table")

    for module_table in module_tables:
        rows = module_table.find_all("tr")

        header = rows[0].find_all("td")
        code = header[0].text.strip()

        if code not in module_codes:
            continue

        i = module_codes.index(code)
        modules[i].verified = True

        desc = rows[-1].find("td").text.strip().replace("'", "").replace("\n", "<br/>")
        modules[i].description = desc

        active_header = ""

        # remove last row as its description and first row because it's the title
        for row in rows[1:-1]:
            cells = row.find_all("td")
            header_cell = cells[0]

            if "grade type" in header_cell.text.lower():
                active_header = "grade type"
                grading = cells[1].text.strip()
                modules[i].grading = grading

            elif "prerequisite" in header_cell.text.lower():
                active_header = "prerequisite"
                prereqs = cells[1].text.strip().replace("OR", "").split(" & ")
                modules[i].prerequisites.append([p.strip() for p in prereqs])

            elif "mutually exclusive" in header_cell.text.lower():
                active_header = "mutex"
                mutex = cells[1].text.strip().split(",")
                modules[i].mutex = [m.strip() for m in mutex]

            # prerequisite format is retarded and uses multiple rows
            elif header_cell.text.strip() == "" and active_header == "prerequisite":
                if cells[1].text.strip() == "":
                    continue

                prereqs = cells[1].text.strip().replace("OR", "").split(" & ")
                modules[i].prerequisites.append([p.strip() for p in prereqs])

    return modules


def get_category_modules_venues(
    course_page_text: str,
) -> tuple[list[Module], dict[str, set[Lesson]]]:
    """Parses the "Load Content of Course" page with all the modules and returns a list
       of modules for the course in the given academic semester and a list of venues

    Args:
        course_page_text (str): Text response from course detail POST request

    Returns:
        tuple[list[Module], dict[str, set[Lesson]]]:
        List of modules for course category in the academic semester
        and its relevant scheduled lessons
    """

    modules = []
    venues: dict[str, set[Lesson]] = {}

    soup = BeautifulSoup(course_page_text, "lxml")
    tbl_headers = soup.find_all("table", {"border": False})

    # each tbl_header represents a module
    for tbl_header in tbl_headers:
        header_cells = tbl_header.find("tr").find_all("td")
        module_code = header_cells[0].text.strip()
        module_name = header_cells[1].text.strip()

        res = cast(re.Match[str], re.search(r"(\d*.\d)\s+AU", header_cells[2].text))
        module_credits = res.group(1)

        module = Module(
            verified=False,
            code=module_code,
            course_codes=[],
            credits=module_credits,
            description="",
            grading="",
            prerequisites=[],
            mutex=[],
            name=module_name,
            index_numbers={},
            exam=None,
        )

        time_table = tbl_header.find_next_sibling()
        time_slots = time_table.find_all("tr")
        index_num = "-1"

        for time_slot in time_slots:
            time_slot_cells = time_slot.find_all("td")
            time_slot_cells = list(map(lambda c: c.text.strip(), time_slot_cells))

            if len(time_slot_cells) == 0:
                continue

            # if index is empty, use the previous stored one
            if time_slot_cells[0] != "":
                index_num = time_slot_cells[0]

            # split the array, skipping the index number
            (
                l_type,
                l_group,
                l_day,
                l_time,
                l_venue,
                l_remark,
            ) = time_slot_cells[1:]

            # some locations are stupid and put unwanted characters
            l_venue = l_venue.replace("/", "").replace('"', "")

            lesson = Lesson(
                index=index_num,
                module_code=module_code,
                type=l_type,
                group=l_group,
                day=l_day,
                time=l_time,
                venue_name=l_venue,
                remark=l_remark,
            )
            if index_num in module.index_numbers:
                module.index_numbers[index_num].append(lesson)
            else:
                module.index_numbers[index_num] = [lesson]

            if len(l_venue) > 0:
                if l_venue in venues:
                    venues[l_venue].add(lesson)
                else:
                    venues[l_venue] = set([lesson])

        modules.append(module)

    return modules, venues


async def scrape():
    semester, categories = get_course_categories()
    modules, venues = scrape_category_modules(semester, categories)

    write_json_course_categories(categories)
    write_json_modules(modules)
    write_json_venues(venues)

    await write_fs_semester_modules("courseCategories", semester, "code", categories)
    await write_fs_semester_modules("modules", semester, "code", modules)
    await write_fs_semester_venue(semester, venues)


"""
Steps:
- Gets all course categories from the class schedule page.
- For each course category, get all modules offered, lessons and venues.
    - Retrieving module and venues uses the class schedule for lesson times.
    - And course content for module descriptions.
    
- Uploads course categories, modules and venues onto firebase.
"""
if __name__ == "__main__":
    asyncio.run(scrape())
