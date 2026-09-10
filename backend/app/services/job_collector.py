import logging
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.config import settings
from app.job_sources.adapters.arbeitnow import ArbeitnowAdapter
from app.models.job import Job, JobCollectionRun
from app.services.job_cleaner import clean_job
from app.services.skill_service import process_job_skills

logger = logging.getLogger(__name__)
ADAPTERS = {"arbeitnow": ArbeitnowAdapter}


def collect_jobs(db: Session, source_name: str | None = None) -> dict:
    source_name = source_name or settings.JOB_SOURCE
    adapter_class = ADAPTERS.get(source_name)
    if not adapter_class:
        raise ValueError(f"Unsupported job source: {source_name}")

    started_at = datetime.now(timezone.utc)
    run = JobCollectionRun(source=source_name, started_at=started_at, status="running")
    db.add(run)
    db.commit()
    result = {"source": source_name, "status": "failed", "jobs_fetched": 0, "jobs_inserted": 0, "jobs_updated": 0, "duplicates_skipped": 0, "errors": []}
    try:
        external_jobs = adapter_class().fetch_jobs()
        result["jobs_fetched"] = len(external_jobs)
        now = datetime.now(timezone.utc)
        for external_job in external_jobs:
            cleaned = clean_job(external_job).values
            existing = db.query(Job).filter(Job.source == cleaned["source"], Job.dedupe_key == cleaned["dedupe_key"]).first()
            if existing:
                changed = any(getattr(existing, key) != value for key, value in cleaned.items())
                for key, value in cleaned.items():
                    setattr(existing, key, value)
                if changed:
                    existing.skills_processed_at = None
                existing.last_seen_at = now
                existing.is_active = True
                result["jobs_updated"] += int(changed)
                result["duplicates_skipped"] += int(not changed)
            else:
                db.add(Job(**cleaned, last_seen_at=now, is_active=True))
                result["jobs_inserted"] += 1
        db.flush()
        for job in db.query(Job).filter(Job.skills_processed_at.is_(None)).all():
            process_job_skills(db, job)
        run.status = "success"
    except Exception as exc:
        logger.exception("Job collection failed for source %s", source_name)
        result["errors"].append(str(exc))
        run.error_message = str(exc)
    run.completed_at = datetime.now(timezone.utc)
    run.jobs_fetched = result["jobs_fetched"]
    run.jobs_inserted = result["jobs_inserted"]
    run.jobs_updated = result["jobs_updated"]
    run.duplicates_skipped = result["duplicates_skipped"]
    run.status = result["status"]
    db.commit()
    return result