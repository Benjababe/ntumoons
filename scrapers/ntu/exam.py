from datetime import datetime

import cchardet
from bs4 import BeautifulSoup
from requests import Session

from util.helper import get_sem_title, session_post_cache
from util.structs import Exam, Module

EXAM_SEMSTER_PAGE = "https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.MainSubmit"
EXAM_TIMETABLE_PAGE = "https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.Get_detail"

OPT_GENERAL = 1


def get_exam_plan_num(sess: Session, semester: str) -> str:
    """Retrieves latest exam plan number.

    Args:
        sess (Session): Persistent session of scraper.
        semester (str): Semester in YYYY;S format.

    Returns:
        str: Latest exam plan number.
    """
    sem_title = get_sem_title(semester, False)

    data = {"p_opt": OPT_GENERAL, "p_type": "UE", "bOption": "Next"}
    res = session_post_cache(sess, EXAM_SEMSTER_PAGE, data)

    soup = BeautifulSoup(res.content, "lxml")
    sem_options = soup.find_all("input", {"name": "p_plan_no"})
    plan_num = next((s for s in sem_options if s.next.strip() == sem_title), None)

    return plan_num["value"] if plan_num is not None else None


def process_exams(modules: list[Module], html: bytes) -> list[Exam]:
    """Parse exam table rows and return structured list.

    Args:
        modules (list[Module]): List of all scraped modules.
        html (bytes): Exam page html bytes.

    Returns:
        list[Module]: List of all modules with exam information.
    """

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

        iso_date = datetime.strptime(date, "%d %B %Y").isoformat()
        hr_time = datetime.strptime(time, "%I.%M %p").strftime("%H:%M:%S")

        exam = Exam(
            module_code=c_code,
            date=date,
            time=time,
            day=day,
            duration=dur,
            iso_date=iso_date,
            hr_time=hr_time,
        )

        for i, module in enumerate(modules):
            if module.code == c_code:
                modules[i].exam = exam
                break

    return modules


def insert_module_exams(
    sess: Session, semester: str, plan_num: str, modules: list[Module]
) -> list[Module]:
    """Inserts exams into all available modules.

    Args:
        sess (Session): Persistent session of scraper.
        semester (str): Semester in "YYYY:SS" format. Eg: 2023;2
        plan_num (str): Scraped plan number.
        modules (list[Module]): List of all scraped modules.

    Returns:
        list[Module]: List of all modules with exam information.
    """

    sem_year, sem_num = semester.split(";")

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
    modules = process_exams(modules, res.content)
    return modules
