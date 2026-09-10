from datetime import datetime, timezone
from typing import Any
import httpx
from app.job_sources.base import ExternalJob, JobSourceAdapter


class ArbeitnowAdapter(JobSourceAdapter):
    name = "arbeitnow"
    api_url = "https://www.arbeitnow.com/api/job-board-api"

    def fetch_jobs(self) -> list[ExternalJob]:
        with httpx.Client(timeout=20.0, headers={"Accept": "application/json"}) as client:
            response = client.get(self.api_url)
            response.raise_for_status()
            payload: Any = response.json()

        jobs = []
        for item in payload.get("data", []):
            posted_date = None
            raw_created = item.get("created_at")
            if raw_created:
                try:
                    posted_date = datetime.fromtimestamp(int(raw_created), tz=timezone.utc).date()
                except (TypeError, ValueError, OSError):
                    posted_date = None
            job_types = item.get("job_types") or []
            jobs.append(ExternalJob(
                title=item.get("title") or "Untitled position",
                company=item.get("company_name"),
                location=item.get("location"),
                description=item.get("description"),
                employment_type=", ".join(job_types) if isinstance(job_types, list) else str(job_types),
                posted_date=posted_date,
                source=self.name,
                source_url=item.get("url") or "",
                external_job_id=str(item.get("slug") or item.get("id")) if item.get("slug") or item.get("id") else None,
                skills=item.get("tags") if isinstance(item.get("tags"), list) else None,
            ))
        return jobs
