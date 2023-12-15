import asyncio
import json
import os

import firebase_admin
from firebase_admin import credentials, firestore_async

from structs import CourseCategory, Dictable, Exam, Module, Staff, Venue

creds = credentials.Certificate("serviceAccountKey.json")
app = firebase_admin.initialize_app(creds)
db = firestore_async.client()


async def write_fs_staff(doc_id_key: str, staff_list: list[Staff]):
    """Writes a list of staff to firestore

    Args:
        doc_id_key (str): Key of staff to use as document id
        staff_list (list[Staff]): List of staff data
    """

    async def write_fs(data: Staff):
        data = data.to_dict()
        doc_id = data[doc_id_key]
        await db.collection("staff").document(doc_id).set(data)

    tasks = [write_fs(data) for data in staff_list]
    await asyncio.gather(*tasks)


async def write_fs_staff_keywords(keywords: list[str]):
    """Writes staff keywords into firestore

    Args:
        coll (str): Staff collection name
        keywords (list[str]): List of keywords to filter staff by
    """

    await db.collection("staff").document("metadata").set({"keywords": keywords})


async def write_fs_semester_modules(
    coll: str, semester: str, doc_id_key: str, data_list: list[Dictable]
):
    """Writes a list of modules to firestore

    Args:
        coll (str): Collection name ("courseCategories"/"module" typically)
        semester (str): Semester to store module in. Eg: 2023;2
        doc_id_key (str): Key of dict to use as document identifier
        data_list (list[Dictable]): List of document data
    """

    async def write_semester_data(data: Dictable):
        data = data.to_dict()
        data["semester"] = semester
        doc_id = f"{semester}_{data[doc_id_key]}"

        await db.collection(coll).document(doc_id).set(data)

    tasks = [write_semester_data(data) for data in data_list]
    await asyncio.gather(*tasks)


async def write_fs_semester_venue(semester: str, venue_list: list[Venue]):
    """Writes a list of venues and lessons to firestore

    Args:
        semester (str): Semester to store module in. Eg: 2023;2
        venue_list (list[Venue]): List of venue data
    """

    async def write_venue_data(venue: Venue):
        base_venue = {"name": venue.name, "lat": venue.lat, "lng": venue.lng}
        lessons = venue.to_dict()["lessons"]
        doc_id = venue.name

        venue_doc = db.collection("venue").document(doc_id)
        actual_doc = await venue_doc.get()
        if not actual_doc.exists:
            await venue_doc.set(base_venue)

        await venue_doc.update({f"{semester}_lessons": lessons})

    tasks = [write_venue_data(venue) for venue in venue_list]
    await asyncio.gather(*tasks)


async def write_fs_semester_exam(semester: str, exam_list: list[Exam]):
    """Updates existing modules in firestore with their exam information

    Args:
        semester (str): Semester to update module. Eg: 2023;2
        exam_list (list[Exam]): List of exam data
    """

    async def write_exam_data(exam: Exam):
        exam = exam.to_dict()
        doc_id = f"{semester}_{exam['module_code']}"
        try:
            await db.collection("module").document(doc_id).update({"exam": exam})
        except:
            print(f"Module {doc_id} does not exist!")

    tasks = [write_exam_data(exam) for exam in exam_list]
    await asyncio.gather(*tasks)


def write_json_staff(staff_list: list[Staff]):
    """Writes faculty staff to a local JSON file

    Args:
        staff (list[Staff]): List of faculty staff
    """

    filepath = "export/staff.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    staff_list = [staff.to_dict() for staff in staff_list]

    with open(filepath, "w") as file:
        json.dump(staff_list, file, indent=2)


def write_json_course_categories(category_list: list[CourseCategory]):
    """Writes course categories to a local JSON file

    Args:
        category_list (list[CourseCategory]): List of course category data
    """

    filepath = "export/courseCategories.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    category_list = [category.to_dict() for category in category_list]

    with open(filepath, "w") as file:
        json.dump(category_list, file, indent=2)


def write_json_modules(module_list: list[Module]):
    """Writes modules to their individual JSON file

    Args:
        exam_list (list[Exam]): List of module data
    """

    dirpath = "export/modules/"
    if not os.path.exists(dirpath):
        os.makedirs(os.path.dirname(dirpath), exist_ok=True)

    for module in module_list:
        filepath = f"{dirpath}/{module.code}.json"
        module_dict = module.to_dict()
        del module_dict["code"]

        with open(filepath, "w") as file:
            json.dump(module_dict, file, indent=2)


def write_json_venues(venue_list: list[Venue]):
    """Writes venues to a local JSON file

    Args:
        venue_list (list[Venue]): List of venue data
    """

    filepath = "export/venues.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    venue_list = [venue.to_dict() for venue in venue_list]

    with open(filepath, "w") as file:
        json.dump(venue_list, file, indent=2)


def write_json_exam(exam_list: list[Exam]):
    """Writes exams to a local JSON file

    Args:
        exam_list (list[Exam]): List of exam data
    """

    filepath = "export/exams.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    exams = {}
    for exam in exam_list:
        exam_dict = exam.to_dict()
        del exam_dict["module_code"]
        exams[exam.module_code] = exam_dict

    with open(filepath, "w") as file:
        json.dump(exams, file, indent=2)
