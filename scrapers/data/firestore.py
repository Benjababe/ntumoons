import asyncio
from typing import Callable

import firebase_admin
from firebase_admin import credentials, firestore_async
from google.cloud.firestore import AsyncDocumentReference

from util.structs import Dictable

creds = credentials.Certificate("serviceAccountKeyDev.json")
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
    override: bool = True,
    override_func: Callable[[dict, dict], dict] = None,
    subcoll_key: str = "",
):
    """Writes a list of data to firestore.

    Args:
        fs_coll (str): Name of firestore collection to write to.
        doc_id_key (str): Key of data to use as firestore document id.
        data_list (list[Dictable]): List of data to upload.
        override (bool, optional): Flag whether to replace existing documents. Defaults to True.
        override_func (Callable[[dict, dict], dict], optional): Function to execute if document exists and override it with its returned value. Defaults to None.
        subcollection_key (str, optional): Key of dictable to use as a subcollection. Value must be a dict. Defaults to ""
    """

    async def write(data: Dictable):
        data_dict = data.to_dict()
        doc_id = data_dict[doc_id_key]
        subcollection_val = None

        async def write_subcollection(
            doc: AsyncDocumentReference, subcollection_val: dict[str, dict]
        ):
            if subcollection_val == None:
                return

            subcollection_ref = doc.collection(subcoll_key)
            for doc_id, val in subcollection_val.items():
                await subcollection_ref.document(doc_id).set(val)

        # does not insert if document exists
        if not override:
            doc = db.collection(fs_coll).document(doc_id)
            actual_doc = await doc.get()
            if not actual_doc.exists:
                if subcoll_key != "":
                    subcollection_val = data_dict[subcoll_key]
                    del data_dict[subcoll_key]

                await doc.set(data_dict)
                await write_subcollection(doc, subcollection_val)

            elif override_func is not None:
                data_dict = override_func(data_dict, actual_doc.to_dict())
                if subcoll_key != "":
                    subcollection_val = data_dict[subcoll_key]
                    del data_dict[subcoll_key]

                await doc.set(data_dict)
                await write_subcollection(doc, subcollection_val)

        else:
            if subcoll_key != "":
                subcollection_val = data_dict[subcoll_key]
                del data_dict[subcoll_key]

            doc = db.collection(fs_coll).document(doc_id)
            await doc.set(data_dict)
            await write_subcollection(doc, subcollection_val)

    tasks = [write(data) for data in data_list]
    await asyncio.gather(*tasks)
