import os
import sys
from typing import TypedDict

import typesense
from dotenv import load_dotenv

from util.structs import Dictable

load_dotenv()


class Document(TypedDict):
    id: str


client: typesense.Client = None

MODULE_COLLECTION = "modules"
STAFF_COLLECTION = "staff"


def create_collection(name: str, fields: list[dict[str, str | bool]]):
    """Creates a typesense collection.

    Args:
        name (str): Name of typesense collection.
        fields (list[dict[str, str  |  bool]]): Fields to index with.
    """

    global client
    try:
        schema = {
            "name": name,
            "fields": fields,
        }
        res = client.collections.create(schema)
        if res["created_at"]:
            print(f"{schema['name']} collection created")
    except Exception as err:
        print(f"An exception occured while creating {schema['name']} collection:", err)


def init_typesense():
    """Initialises required collections in typesense node."""

    if (
        os.environ.get("TYPESENSE_HOST") is None
        or os.environ.get("TYPESENSE_PORT") is None
        or os.environ.get("TYPESENSE_PROTOCOL") is None
        or os.environ.get("TYPESENSE_API_KEY") is None
    ):
        print("Ensure your .env file has the TYPESENSE variables!")
        sys.exit()

    global client
    client = typesense.Client(
        {
            "nodes": [
                {
                    "host": os.environ.get("TYPESENSE_HOST"),
                    "port": os.environ.get("TYPESENSE_PORT"),
                    "protocol": os.environ.get("TYPESENSE_PROTOCOL"),
                }
            ],
            "api_key": os.environ.get("TYPESENSE_API_KEY"),
            "connection_timeout_seconds": 5,
        }
    )

    desc_field = {"name": "description", "type": "string"}
    create_collection(
        MODULE_COLLECTION,
        [
            desc_field,
            {"name": "name", "type": "string"},
            {"name": "year", "type": "string"},
            {"name": "semester_num", "type": "string"},
            {"name": "name_pretty", "type": "string"},
            {"name": "code", "type": "string"},
        ],
    )
    create_collection(
        STAFF_COLLECTION,
        [
            desc_field,
            {"name": "title", "type": "string"},
            {"name": "email", "type": "string"},
            {"name": "keywords", "type": "string[]", "facet": True},
            {"name": "profile_pic_url", "type": "string"},
            {"name": "appointments", "type": "string[]"},
            {"name": "tag", "type": "string"},
        ],
    )


def upsert_document(collection: str, document: Document):
    """Inserts or update document based on id.

    Args:
        collection (str): Name of collection to upsert to.
        document (Document): Dict of indexable information, must have an "id" key.
    """

    global client
    client.collections[collection].documents.upsert(document)


def typesense_upsert(
    collection: str,
    id_key: str,
    data_list: list[Dictable],
    attributes: list[str],
    id_prepend: str = "",
):
    """Inserts of update documents in bulk.

    Args:
        coll (str): Name of collection to upsert for indexing.
        id_key (str): Key of Dictable to use as document id.
        d_list (list[Dictable]): List of data to upsert.
        attrs (list[str]): Attributes to keep for indexing.
        id_prepend (str, optional): Value to prepend document id with. Defaults to "".
    """

    global client

    documents = []
    for data in data_list:
        data = data.to_dict()
        document = {"id": f"{id_prepend}{data[id_key]}"}

        for attr in attributes:
            document[attr] = data[attr]
        documents.append(document)

    action_mode = {"action": "upsert"}
    res = client.collections[collection].documents.import_(documents, action_mode)
    success_count = len([item for item in res if item["success"]])

    print(
        f"{success_count}/{len(res)} documents saved to Typesense '{collection}' collection"
    )


if __name__ == "__main__":
    init_typesense()
