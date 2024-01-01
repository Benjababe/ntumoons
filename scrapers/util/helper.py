import os
import pickle
import re
import time
from typing import Any, cast

from requests import Response, Session

# stores current data of opened files to prevent rereading
# just write the values in cache map to the file directly
CACHE_MAP = {}


SESS_TIMEOUT = 10000
CACHE_TIMEOUT = 60 * 60 * 24 * 14


def session_get_cache(
    sess: Session,
    url: str,
    sess_timeout: int = SESS_TIMEOUT,
    cache_timeout: int = CACHE_TIMEOUT,
) -> Response:
    """Retrieves GET response from url. Uses cached value if available.

    Args:
        sess (Session): requests.Session object for HTTP request
        url (str): URL to access
        sess_timeout (int): GET request timeout in milliseconds
        cache_timeout (int): How long cached data will persist in seconds

    Returns:
        Response: HTTP response
    """

    filename = "session_get"
    res = cast(Response | None, read_cache(filename, url))
    if res is None:
        res = sess.get(url, timeout=sess_timeout)
        if res.ok:
            res.close()
            write_cache(filename, url, res, cache_timeout)
            return res
    else:
        return res


def session_post_cache(
    sess: Session,
    url: str,
    data: dict,
    sess_timeout: int = SESS_TIMEOUT,
    cache_timeout: int = CACHE_TIMEOUT,
) -> Response:
    """Retrives POST response from url. Uses cached value if available.

    Args:
        sess (Session): requests.Session object for HTTP request
        url (str): URL to access
        data (dict): Data to include as payload
        sess_timeout (int): GET request timeout in milliseconds
        cache_timeout (int): How long cached data will persist in seconds

    Returns:
        Response: HTTP response
    """

    filename = "session_post"
    key = f"{url}_{str(data)}"

    res = cast(Response | None, read_cache(filename, key))
    if res is None:
        res = sess.post(url, data=data, timeout=sess_timeout)
        if res.ok:
            res.close()
            write_cache(filename, key, res, cache_timeout)
            return res
    else:
        return res


def read_cache(filename: str, key: str) -> Any | None:
    """Reads and return cached value if available

    Args:
        filename (str): Cache container
        key (str): Identifier for cached value

    Returns:
        Any | None: Either cached value or None if does not exist
    """

    filepath = f"cache/{filename}.pkl"

    # cache file doesn't exist
    if not os.path.exists(filepath):
        return None

    # keep a global variable for cache to prevent repeated reads
    if filepath in CACHE_MAP:
        if key in CACHE_MAP[filepath]:
            cache = CACHE_MAP[filepath]
            cached = cache[key]
            return cached["v"] if cached["t"] > int(time.time()) else None
        else:
            return None

    with open(filepath, "rb") as handle:
        cache = pickle.load(handle)
        CACHE_MAP[filepath] = cache

        if key not in cache:
            return None
        else:
            # check if value has expired
            cached = cache[key]
            return cached["v"] if cached["t"] > int(time.time()) else None


def write_cache(filename: str, key: str, value: Any, timeout: int = CACHE_TIMEOUT):
    """Writes value to cache

    Args:
        filename (str): Cache container
        key (str): Identifier for cached value
        value (Any): Value to cache
        timeout: (int): Duration the value will persist for in seconds
    """

    filepath = f"cache/{filename}.pkl"

    if not os.path.exists(filepath):
        # create parent directory if doesn't exist
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        CACHE_MAP[filepath] = {}

    # only read cache file if haven't already done so
    # get current file content if exists
    if filepath not in CACHE_MAP:
        with open(filepath, "rb") as handle:
            cache = pickle.load(handle)
            CACHE_MAP[filepath] = cache

    # append/replace value to pickle
    with open(filepath, "wb") as handle:
        stored_val = {"v": value, "t": int(time.time()) + timeout}
        CACHE_MAP[filepath][key] = stored_val
        pickle.dump(CACHE_MAP[filepath], handle)


def merge_dicts_sets(dict1: dict[str, set], dict2: dict[str, set]):
    """Merge 2 dictionaries with sets as values

    Args:
        dict1 (dict[str, set])
        dict2 (dict[str, set])

    Returns:
        _type_: Single dict with equal keys merged in value
    """

    merged = dict1.copy()
    for key, value in dict2.items():
        if key in merged:
            merged[key].union(value)
        else:
            merged[key] = value
    return merged


def get_sem_title(semester: str, tidy: bool) -> str:
    pattern = r"\d{2}(\d{2});(\d{1})"
    matches = re.search(pattern, semester)
    ay, sem_num = int(matches.group(1)), matches.group(2)

    if tidy:
        return f"AY 20{ay}/{ay+1} Semester {sem_num}"
    else:
        return f"AY20{ay}-{ay+1} SEM {sem_num}"


def merge_venue(venue: dict, stored_venue: dict):
    stored_venue["lessons"].update(venue["lessons"])
    return stored_venue
