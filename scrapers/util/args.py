import argparse


def get_args() -> argparse.Namespace:
    """Returns any arguments passed into the executable.

    Returns:
        argparse.Namespace: Set of arguments provided.
    """

    parser = argparse.ArgumentParser(
        description="Scrape modules for a specific semester."
    )
    parser.add_argument(
        "-s",
        "--semester",
        metavar="semester",
        type=str,
        help="Semester in YYYY;S format.",
        nargs="?",
        default="",
    )
    parser.add_argument(
        "-e",
        "--environment",
        metavar="environment",
        type=str,
        help="Environment to scrape for. Either 'prod', 'staging' or 'dev'.",
        nargs="?",
        default="Dev",
    )
    args = parser.parse_args()
    return args
