# NTUMoons Scraper

## Sites Scraped

- [Course Information Selection](https://wis.ntu.edu.sg/webexe/owa/aus_subj_cont.main)
- [Course Schedule Information](https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main)
- [Exam Timetable](https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.main)
- [NTU Staff](https://www.ntu.edu.sg/research/faculty-directory)

## Setup

### Scraper
Python 3.11 was used during development, YMMV.

Setup environment with

```bash
python -m venv .venv
./.venv/Scripts/activate
pip install -r requirements.txt
```

### Typesense Uploader
Typesense is used to index searching for modules and staff. It's hosted on a free [render](https://github.com/hmbrg/typesense-on-render) instance as of writing because free.

A `.env` file is required containing the following environment variables.

```bash
TYPESENSE_HOST=""
TYPESENSE_PORT=""
TYPESENSE_PROTOCOL=""
TYPESENSE_API_KEY=""
```

### Scraping

Just run `python scrape.py` and pray everything goes smoothly.

## Scraping Flow

For those who don't want to look at the script, this is a short overview:

1. Initialise Typesense collections for insertion

2. Scrape modules and everything related to them
    - Retrieve current semester and course categories
    - Retrieve all modules for all course categories
    - Retrieve venues for all modules and their respective lesson times
    - Save data to local JSON files (Module codes and venues are used for now)
    - Insert indexable data (Modules only currently) to Typesense host
    - Upload modules, course categories and venues to Firebase

3. Scrape faculty staff and their related information
    - Scrape all staff pages for their basic info
    - For each staff member, scrape their individual page for more detailed stuff
    - Gets commonly used keywords for staff members (>= 5 occurrences)
    - Save data to local JSON files (in case)
    - Insert indexable data (Staff only currently) to Typesense host
    - Upload staff and their keywords to Firebase

## Structure

You can refer to `util/structs.py` for how data is structured for storage, I don't got time to put everything here.