import asyncio
from typing import Callable

import firebase_admin
from firebase_admin import credentials, firestore_async

from util.structs import Dictable

creds = credentials.Certificate("serviceAccountKey.json")
app = firebase_admin.initialize_app(creds)
db = firestore_async.client()


async def write_fs(fs_coll: str, doc_id: str, data: dict):
    """Writes data to firestore.

    Args:
        fs_coll (str): Name of firestore collection to write to.
        doc_id (str): Document id to write as
        data (dict): Data for the document
    """

    await db.collection(fs_coll).document(doc_id).set(data)


async def write_fs_list(
    fs_coll: str,
    doc_id_key: str,
    data_list: str,
    doc_id_prepend: str = "",
    override: bool = True,
    override_func: Callable[[dict, dict], dict] = None,
):
    """_summary_

    Args:
        fs_coll (str): _description_
        doc_id_key (str): _description_
        data_list (str): _description_
        doc_id_prepend (str, optional): _description_. Defaults to "".
        override (bool, optional): _description_. Defaults to True.

    """

    """Writes a list of data to firestore.

    Args:
        fs_coll (str): Name of firestore collection to write to.
        doc_id_key (str): Key of data to use as firestore document id.
        data_list (list[Dictable]): List of data to upload.
        doc_id_prepend (str, optional): String to prepend document id with. Defaults to "".
        override (bool, optional): Flag whether to replace existing documents. Defaults to True.
        override_func (Callable[[dict, dict], dict], optional): Function to execute if document exists and override it with its returned value. Defaults to None.
    """

    async def write(data: Dictable):
        data_dict = data.to_dict()
        doc_id = f"{doc_id_prepend}{data_dict[doc_id_key]}"

        # does not insert if document exists
        if not override:
            doc = db.collection(fs_coll).document(doc_id)
            actual_doc = await doc.get()
            if not actual_doc.exists:
                await doc.set(data_dict)
            elif override_func is not None:
                data_dict = override_func(data_dict, actual_doc.to_dict())
                await doc.set(data_dict)

        else:
            await db.collection(fs_coll).document(doc_id).set(data_dict)

    tasks = [write(data) for data in data_list]
    await asyncio.gather(*tasks)
