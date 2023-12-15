import typesense

client = typesense.Client(
    {
        "nodes": [
            {
                "host": "typesense.benjababe.duckdns.org",
                "port": "443",
                "protocol": "https",
            }
        ],
        "api_key": "a60441d1-64a9-4c7d-9096-d2f06f851f00",
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
