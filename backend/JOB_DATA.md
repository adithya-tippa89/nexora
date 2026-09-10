# Module 2: Real Job Data Collection

## Selected source

- **Source:** Arbeitnow public Job Board API
- **API URL:** https://www.arbeitnow.com/api/job-board-api
- **Source site / attribution:** https://www.arbeitnow.com
- **Collection method:** `app.job_sources.adapters.arbeitnow.ArbeitnowAdapter` makes an HTTP GET request to the documented public JSON endpoint. No website scraping or API key is used.
- **Update model:** The endpoint is queried whenever the manual collector or scheduler runs. The default interval is six hours and is configured with `JOB_COLLECTION_INTERVAL_HOURS`.
- **Fields collected:** title, company, location, description, employment type, posted date, source URL, external job identifier, and source-provided tags as skills.
- **Limitations:** The feed is primarily Germany-focused and does not guarantee Maharashtra postings. A missing Maharashtra result is therefore a genuine source limitation, not a static fallback. Source availability, retention, terms, rate limits, and field completeness can change; collection failures are recorded in `job_collection_runs` and logged.

A live adapter verification on 2026-09-10 returned 250 records. These records are not committed as seed data; they are fetched only by the collector and persisted to the configured database.

## Data flow

`source adapter -> fetch -> clean/normalize -> deterministic deduplication -> PostgreSQL upsert`

The adapter interface in `app/job_sources/base.py` allows another permitted API or public feed to be added without changing the collector or API routes.

## Database

Alembic migration `002_create_jobs.py` adds:

- `jobs`: normalized postings, source identifiers, source URL, location fields, optional structured skills, freshness timestamps, and active state.
- `job_collection_runs`: source, run timestamps, fetched/inserted/updated/duplicate counts, status, and error message.

`jobs` has indexes for title, company, district, state, posted date, source, external ID, and active state. A unique constraint on `source + dedupe_key` prevents repeated rows.

## Cleaning and deduplication

- Whitespace is collapsed and empty strings become null.
- Known states and known Maharashtra districts are extracted only on exact matches. Unknown locations preserve the original location and leave district/state null.
- Dates and employment types are normalized by the adapter.
- Stable source IDs are preferred. If a source has no stable ID, a SHA-256 fingerprint is made from normalized title, company, location, and source URL.
- Existing rows are updated and marked active with a new `last_seen_at`. Missing source records are not deleted automatically.

## API

All endpoints are also available under `/api` for reverse-proxy compatibility.

- `GET /jobs?page=1&page_size=25&state=&district=&title=&company=&employment_type=&source=&posted_date=`
- `GET /jobs/{job_id}`
- `GET /jobs/stats`
- `GET /jobs/stats/location`
- `POST /jobs/collect` (admin JWT required)

The frontend page at `/jobs` calls FastAPI directly through `VITE_AUTH_API_URL` and displays database-backed rows and statistics. The existing Express role-analysis APIs remain unchanged because those are legacy occupational-role analytics, not collected postings.

## Commands

From `backend`:

```powershell
python -m pip install -r requirements.txt
python -m alembic upgrade head
python -m app.jobs.collect
python -m app.jobs.scheduler
python -m uvicorn app.main:app --reload --port 8000
```

`python -m app.jobs.scheduler` uses `JOB_COLLECTION_INTERVAL_HOURS`; use a process supervisor in production. The manual collector is the preferred development command.

## Tests

```powershell
python -m pytest -q tests/test_auth.py
```

The suite covers the existing authentication behavior plus job cleaning, location extraction, idempotent collection, API filtering, and anonymous collection rejection. The live adapter was separately invoked and returned records from the public endpoint. Frontend verification:

```powershell
cd ..\frontend
npm run build
```

Known environment note: use `python -m pytest` so the test runner matches the Python interpreter where `requirements.txt` was installed.
