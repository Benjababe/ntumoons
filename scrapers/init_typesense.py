import os

import typesense
from dotenv import load_dotenv

load_dotenv()

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


if __name__ == "__main__":
    create_collection(
        "modules",
        [
            {"name": "name", "type": "string"},
            {"name": "code", "type": "string"},
        ],
    )
    create_collection("courseCategories", [{"name": "name", "type": "string"}])
    create_collection("staff", [{"name": "title", "type": "string"}])
    create_collection("venues", [{"name": "name", "type": "string"}])
