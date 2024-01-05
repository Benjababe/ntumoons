# NTUMoons Scraper

## Sites Scraped

- [Course Information Selection](https://wis.ntu.edu.sg/webexe/owa/aus_subj_cont.main)
- [Course Schedule Information](https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main)
- [Exam Timetable](https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.main)
- [NTU Staff](https://www.ntu.edu.sg/research/faculty-directory)

## Setup

### Scraper

Python 3.11 was used during development but there are no version specific features used.

Setup environment with

```bash
python -m venv .venv
./.venv/Scripts/activate
pip install -r requirements.txt
```

Ensure `serviceAccountKeyDev.json` exists in the root directory. If not, it can be exported from firebase. Refer to `serviceAccountKeyDev.example.json` for reference. It should be generated off a development instance of the Firebase project.

### Typesense Uploader

Typesense is used to index searching for modules and staff. It's hosted on a free [render](https://github.com/hmbrg/typesense-on-render) instance on my potato computer as of writing because free.

A `.env` file is required containing the environment variables related to Typesense. Refer to `.env.example` for reference.

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

## Course Category

Course category is broken into 4 components: `<course/category code> ; <secondary code> ; <year of study> ; <part/full time>`. Eg. `CSC;;4;F` -> Computer Science, Year 4, Full time student.

### Components

- `<course/category code>` is either the standard course code (`ME` for Mech Eng) or is paired with the secondary code (`MLOAD;CHIN` for Minor in Chinese). A list of known category codes are `MLOAD (Minor)`, `GERP (GERPE)`, `EP (English Proficiency)`, `CNY (C N Yang Scholars)`, `USP (Uni Scholars)` and `GLOAD (BDE/UE)`.
- `<secondary code>` is usually left blank and as mentioned above, it tied with the `<course/category code>` to provide complimentary info. Eg `MS;ITG` -> Maritime Studies (ITG).
- `<year of study>` is pretty self explanitory.
- `<part/full time>` just indicates the type of study.
