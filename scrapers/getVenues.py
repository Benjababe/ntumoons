import json
import os

from data.json import write_json


def get_semester_directories():
    path = "export"
    return [
        f"{path}/{d}" for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))
    ]


def generate_venues_basic():
    venues_basic: set[str] = set()

    semester_dirs = get_semester_directories()
    for path in semester_dirs:
        venues_basic_path = f"{path}/venuesBasic.json"
        with open(venues_basic_path, "r") as f:
            data: list[str] = json.load(f)
            venues_basic = venues_basic.union(data)

    write_json(list(venues_basic), "venuesBasic", True)


if __name__ == "__main__":
    generate_venues_basic()
