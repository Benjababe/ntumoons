import json
import os
import sys

import aioboto3
import boto3
from dotenv import load_dotenv
from tqdm.asyncio import tqdm_asyncio

from util.structs import Dictable

load_dotenv()

session = None
sync_r2 = None


def get_client_args():
    return {
        "service_name": "s3",
        "endpoint_url": os.environ.get("R2_ENDPOINT"),
        "aws_access_key_id": os.environ.get("R2_ACCESS_KEY_ID"),
        "aws_secret_access_key": os.environ.get("R2_SECRET_ACCESS_KEY"),
        "region_name": os.environ.get("R2_REGION_NAME"),
    }


def init_r2():
    global session, sync_r2

    if (
        os.environ.get("R2_ENDPOINT") is None
        or os.environ.get("R2_ACCESS_KEY_ID") is None
        or os.environ.get("R2_SECRET_ACCESS_KEY") is None
        or os.environ.get("R2_REGION_NAME") is None
    ):
        print("Ensure your .env file has the R2 variables!")
        sys.exit()

    session = aioboto3.Session()

    sync_r2 = boto3.client(**get_client_args())

    create_bucket("course-categories")
    create_bucket("modules")
    create_bucket("semester")
    create_bucket("staff")
    create_bucket("venues")


def create_bucket(name: str):
    global sync_r2

    try:
        sync_r2.create_bucket(Bucket=name)
        print(f"Successfully created bucket '{name}'")
    except Exception as err:
        print(f"An exception occured while creating bucket '{name}':", err)


def write_r2(bucket: str, key: str, data: dict):
    """Writes data to cloudflare R2

    Args:
        bucket (str): Name of bucket to write to.
        key (str): Name of the key to be stored as.
        data_list (dict): Data to upload to the key.
    """

    global sync_r2
    body = json.dumps(data)
    sync_r2.put_object(Body=body, Bucket=bucket, Key=key)


async def write_r2_list(
    bucket: str,
    name_key: str,
    data_list: list[Dictable],
    key_prepend: str = "",
    override: bool = True,
):
    """Writes data to cloudflare R2.

    Args:
        bucket (str): Name of bucket to write to.
        name_key (str): Key of data to use as bucket key.
        data_list (list[Dictable]): List of data to upload.
        key_prepend (str, optional): String to prepend bucket key with. Defaults to "".
        override (bool, optional): Flag whether to replace existing objects. Defaults to True.
    """
    global session

    async def write(data: Dictable, r2):
        data_dict = data.to_dict()
        key = f"{key_prepend}{data_dict[name_key]}"

        # does not insert if object exists
        if not override:
            try:
                # throws exception if doesn't exist
                await r2.head_object(Bucket=bucket, Key=key)
            except:
                body = json.dumps(data_dict)
                await r2.put_object(Body=body, Bucket=bucket, Key=key)

        else:
            body = json.dumps(data_dict)
            await r2.put_object(Body=body, Bucket=bucket, Key=key)

    async with session.client(**get_client_args()) as r2:
        tasks = [write(data, r2) for data in data_list]
        desc = f"Writing to R2 Bucket '{bucket}'"
        for f in tqdm_asyncio.as_completed(tasks, desc=desc):
            await f


if __name__ == "__main__":
    init_r2()
