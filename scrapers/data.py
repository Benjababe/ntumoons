import asyncio
import json
import os

import firebase_admin
from firebase_admin import credentials, firestore_async

from util.structs import Dictable
from util.typesense import upsert_document

creds = credentials.Certificate("serviceAccountKey.json")
app = firebase_admin.initialize_app(creds)
db = firestore_async.client()


async def write_fs_staff_keywords(keywords: list[str]):
    """Writes staff keywords into firestore.

    Args:
        coll (str): Staff collection name.
        keywords (list[str]): List of keywords to filter staff by.
    """

    await db.collection("staff").document("metadata").set({"keywords": keywords})


async def write_fs(
    fs_coll: str,
    doc_id_key: str,
    data_list: str,
    doc_id_prepend: str = "",
    override: bool = True,
):
    """Writes data to firestore.

    Args:
        fs_coll (str): Name of firestore collection to write to.
        doc_id_key (str): Key of data to use as firestore document id.
        data_list (list[Dictable]): List of data to upload.
        doc_id_prepend (str, optional): String to prepend document id with. Defaults to "".
        override (bool, optional): Flag whether to replace existing documents. Defaults to True.
    """

    async def write(data: Dictable):
        data = data.to_dict()
        doc_id = f"{doc_id_prepend}_{data[doc_id_key]}"

        # does not insert if document exists
        if not override:
            doc = db.collection(fs_coll).document(doc_id)
            actual_doc = await doc.get()
            if not actual_doc.exists:
                await doc.set(data)

        else:
            await db.collection(fs_coll).document(doc_id).set(data)

    tasks = [write(data) for data in data_list]
    await asyncio.gather(*tasks)


def write_json(data_list: list[Dictable], filename: str):
    """Writes dictable data into a JSON file

    Args:
        data_list (list[Dictable]): List of data to save
        filename (str): Filename of the output JSON file
    """

    filepath = f"export/{filename}.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    data_list = [data.to_dict() for data in data_list]

    if os.path.exists(filepath):
        print(f"{filepath} already exists")
        return

    with open(filepath, "w") as file:
        json.dump(data_list, file, indent=2)


def write_json_invidivual(data_list: list[Dictable], subfolder_name: str, fn_key: str):
    """Writes dictable data into their own individual JSON file

    Args:
        data_list (list[Dictable]): List of data to save
        subfolder_name (str): Folder to contain individual JSON files
        fn_key (str): Key of the dictable to use as the filename
    """

    dirpath = f"export/{subfolder_name}/"
    if not os.path.exists(dirpath):
        os.makedirs(os.path.dirname(dirpath), exist_ok=True)

    for data in data_list:
        data_dict = data.to_dict()
        filepath = f"{dirpath}/{data_dict[fn_key]}.json"

        if os.path.exists(filepath):
            print(f"{filepath} already exists")
            return

        with open(filepath, "w") as file:
            json.dump(data_dict, file, indent=2)
