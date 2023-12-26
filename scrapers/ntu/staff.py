import re
from collections import defaultdict

from bs4 import BeautifulSoup
from requests import Session

from util.helper import read_cache, session_get_cache, write_cache
from util.structs import Staff

CACHE_FILENAME = "staff"
FACULTY_DIR_PAGE = "https://www.ntu.edu.sg/research/faculty-directory/GetAcademicProfiles/?searchFaculty=&interests=all&page={}"


def get_all_staff(sess: Session) -> list[Staff]:
    """Retrieves all faculty staff information.

    Args:
        sess (Session): Persistent session of scraper.

    Returns:
        list[Staff]: List of all faculty staff.
    """

    all_staff = read_cache(CACHE_FILENAME, "all_staff")
    if all_staff is not None:
        return all_staff

    all_staff = []
    page_num = 1
    total_pages = 1

    while page_num < total_pages + 1:
        print(f"Fetching page {page_num}/{total_pages}", end="\r")
        url = FACULTY_DIR_PAGE.format(page_num)
        res = session_get_cache(sess, url)

        page_num += 1

        if res.ok:
            data = res.json()
            total_pages = data["totalPages"]
            all_staff += get_staff_in_page(sess, data["items"])
        else:
            break

    write_cache(CACHE_FILENAME, "all_staff", all_staff)

    print()
    return all_staff


def get_staff_details(sess: Session, url: str) -> Staff:
    """Scrapes staff dedicated page in digital repository.

    Args:
        sess (Session): Persistent session of scraper.
        url (str): Staff page URL.

    Returns:
        Staff: Staff object populated with additional information.
    """

    details = defaultdict(lambda: None)
    res = session_get_cache(sess, url)

    if res.ok:
        soup = BeautifulSoup(res.text, "lxml")

        p_url = soup.select_one("#personalsiteDiv a")
        details["personal_url"] = "" if p_url is None else p_url.attrs["href"]

        keywords = soup.select("#researchkeywords a")
        details["keywords"] = list(map(lambda kw: kw.text.strip(), keywords))

        bio = soup.select_one("#biographyDiv")
        details["biography"] = "" if bio is None else bio.text.strip()

        research_interests = soup.select_one("#researchinterestsDiv div")
        if research_interests is not None:
            interests = "".join(map(str, research_interests.contents))
            interests = re.split("<br>|</br>", interests)
            details["research_interests"] = list(filter(lambda i: i != "", interests))

        current_grants = soup.select("#currentgrantsDiv li")
        details["current_grants"] = list(map(lambda g: g.text.strip(), current_grants))

    return details


def get_staff_in_page(sess: Session, data: list[dict]) -> list[Staff]:
    """For a scraped page, get all of the staff in the page

    Args:
        sess (Session): Persistent session of scraper.
        data (list[dict]): Response from the staff request

    Returns:
        list[Staff]: List of staff in the page scraped
    """

    staff = list(map(lambda d: staff_dict_to_obj(sess, d), data))
    return staff


def staff_dict_to_obj(sess: Session, s_dict: dict) -> Staff:
    """Converts a generic staff dict to a structured Staff object.

    Args:
        sess (Session): Persistent session of scraper.
        s_dict (dict): Generic staff dict.

    Returns:
        Staff: Proper Staff object.
    """

    details = get_staff_details(sess, s_dict["url"])

    appointments = (
        []
        if s_dict["appointments"] is None
        else list(map(str.strip, s_dict["appointments"].split("<br/>")))
    )
    interests = (
        []
        if s_dict["interests"] is None
        else list(map(str.strip, s_dict["interests"].split("|")))
    )

    return Staff(
        title=s_dict["title"],
        email=s_dict["email"],
        tag=s_dict["tag"],
        url=s_dict["url"],
        profile_pic_url=s_dict["profilepictureurl"],
        description=s_dict["description"],
        appointments=appointments,
        interests=interests,
        personal_url=details["personal_url"],
        biography=details["biography"],
        keywords=details["keywords"],
        research_interests=details["research_interests"],
        current_grants=details["current_grants"],
    )


def get_keywords(staff_list: list[Staff]) -> list[str]:
    """Gets relevant keywords for faculty staff. Only include those with 5 or more occurrences.

    Args:
        staff_list (list[Staff]): List of faculty staff.

    Returns:
        list[str]: All relevant keywords.
    """

    keyword_count = defaultdict(lambda: 0)
    for staff in staff_list:
        for keyword in staff.keywords:
            keyword_count[keyword] += 1

    keywords = []
    for keyword, count in keyword_count.items():
        if count >= 5:
            keywords.append(keyword)

    return sorted(keywords)
