import asyncio
import re
from datetime import datetime
from typing import cast

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter, Retry

from data import write_fs_semester_exam, write_json_exam
from structs import Exam
from util import session_post_cache

CACHE_FILENAME = "exams"
EXAM_SEMSTER_PAGE = "https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.MainSubmit"
EXAM_TIMETABLE_PAGE = "https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.Get_detail"

OPT_GENERAL = 1
OPT_STUDENT = 2

retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
sess = requests.Session()
sess.mount("https://", HTTPAdapter(max_retries=retries))


def get_latest_sem() -> tuple[str, str, str]:
    """Returns latest semester and exam plan number

    Returns:
        tuple[str, str, str]: Semester year, number and exam plan number
    """

    data = {"p_opt": OPT_GENERAL, "p_type": "UE", "bOption": "Next"}
    res = session_post_cache(sess, EXAM_SEMSTER_PAGE, data)

    soup = BeautifulSoup(res.text, "lxml")
    latest_semester = soup.find_all("input", {"name": "p_plan_no"})[-1]

    semester_name = latest_semester.next.strip()
    match = cast(re.Match, re.search(r"^AY(\d+)-\d+\sSEM\s(\d+)$", semester_name))

    return match.group(1), match.group(2), latest_semester["value"]


def process_exams(html: str) -> list[Exam]:
    """Parse exam table rows and return structured list

    Args:
        html (str): Exam page html string

    Returns:
        list[Exam]: Parsed list of Exam objects
    """

    exams: list[Exam] = []
    soup = BeautifulSoup(html, "lxml")
    exam_rows = soup.find_all("tr", {"align": "yes"})

    # exam rows: date / day / time / course code / course title / duration
    for exam_row in exam_rows:
        exam_details = exam_row.find_all("td")

        if len(exam_details) == 0:
            continue

        date = exam_details[0].text.strip()
        day = exam_details[1].text.strip()
        time = exam_details[2].text.strip()
        c_code = exam_details[3].text.strip()
        c_title = exam_details[4].text.strip()
        dur = exam_details[5].text.strip()

        date = datetime.strptime(date, "%d %B %Y").isoformat()
        time = datetime.strptime(time, "%I.%M %p").strftime("%H:%M:%S")

        exam = Exam(module_code=c_code, date=date, time=time, day=day, duration=dur)
        exams.append(exam)

    return exams


def get_exams(sem_year: str, sem_num: str, plan_num: str) -> list[Exam]:
    """Get all exams in a structured object

    Args:
        sem_year (str)
        sem_num (str)
        plan_num (str)

    Returns:
        list[Exam]: List of all exams for the semester
    """

    data = {
        "p_exam_dt": "",
        "p_start_time": "",
        "p_dept": "",
        "p_subj": "",
        "p_venue": "",
        "p_matric": "",
        "academic_session": "",
        "p_plan_no": plan_num,
        "p_exam_yr": sem_year,
        "p_semester": sem_num,
        "p_type": "UE",
        "bOption": "Next",
    }
    res = session_post_cache(sess, EXAM_TIMETABLE_PAGE, data)
    exams = process_exams(res.text)
    return exams


async def scrape():
    sem_year, sem_num, plan_num = get_latest_sem()
    exams = get_exams(sem_year, sem_num, plan_num)

    write_json_exam(exams)
    await write_fs_semester_exam("modules", f"{sem_year};{sem_num}", exams)


"""
NOTE: Before scraping exams, ensure modules are already scraped.
      This scraper updates existing modules in firebase!
      
      Sometimes the exam page uses newer course codes than those reflected
      in the course info/schedule pages. 
      (2023;2 has CZ3007 & SC4242 in exams but only CZ3007 is in the class schedule)
      Those modules will just be ignored in that case.
      
Steps:
- Retrieves latest semester through the semester selection page.
- Get all exams for that semester.
- Update modules with the exam date/times.
"""
if __name__ == "__main__":
    asyncio.run(scrape())
