import json
import os

from util.structs import Dictable


def write_json(
    data_list: list[Dictable],
    filename: str,
    keep_attrs: list[str] = None,
    sort_key: str = None,
):
    """Writes dictable data into a JSON file

    Args:
        data_list (list[Dictable]): List of data to save
        filename (str): Filename of the output JSON file
        keep_attrs (list[str], optional): List of attributes to keep. Defaults to None
        sort_key (str, optional): If the output needs to be sorted, key will be used
    """

    filepath = f"export/{filename}.json"
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

    if os.path.exists(filepath):
        print(f"{filepath} already exists")
        return

    if keep_attrs is None:
        store_list = [data.to_dict() for data in data_list]
    else:
        store_list = []
        for data in data_list:
            data = data.to_dict()
            store = {}
            for attr in keep_attrs:
                store[attr] = data[attr]
            store_list.append(store)

    if sort_key is not None:
        store_list = sorted(store_list, key=lambda d: d[sort_key])

    with open(filepath, "w") as file:
        json.dump(store_list, file, indent=2)


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
