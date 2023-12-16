import os
import sys
from typing import TypedDict

import typesense
from dotenv import load_dotenv

load_dotenv()


class Document(TypedDict):
    id: str


client: typesense.Client = None

MODULE_COLL = "modules"
STAFF_COLL = "staff"


def create_collection(name: str, fields: list[dict[str, str | bool]]):
    """Creates a typesense collection

    Args:
        name (str): Name of typesense collection
        fields (list[dict[str, str  |  bool]]): Fields to index with
    """

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


def init():
    """Initialises required collections in typesense node"""
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

    name_field = {"name": "name", "type": "string"}
    desc_field = {"name": "description", "type": "string"}
    semester_field = {"name": "semester", "type": "string"}

    create_collection(
        MODULE_COLL,
        [name_field, semester_field, desc_field, {"name": "code", "type": "string"}],
    )
    create_collection(STAFF_COLL, [desc_field, {"name": "title", "type": "string"}])


def upsert_document(collection: str, document: Document):
    """Inserts or update document based on id

    Args:
        collection (str): Name of collection to upsert to
        document (Document): Dict of indexable information, must have an "id" key
    """

    client.collections[collection].documents.upsert(document)


if __name__ == "__main__":
    init()
