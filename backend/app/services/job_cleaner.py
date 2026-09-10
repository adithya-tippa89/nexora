import hashlib
import re
from dataclasses import dataclass
from app.job_sources.base import ExternalJob

MAHARASHTRA_DISTRICTS = {
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur",
    "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal",
}
KNOWN_STATES = {"Maharashtra", "Karnataka", "Gujarat", "Delhi", "Tamil Nadu", "Telangana", "Kerala", "Rajasthan"}


@dataclass
class CleanJob:
    values: dict


def clean_text(value):
    if value is None:
        return None
    cleaned = re.sub(r"\s+", " ", str(value)).strip()
    return cleaned or None


def parse_location(raw_location):
    location = clean_text(raw_location)
    if not location:
        return location, None, None
    parts = [clean_text(part) for part in location.split(",") if clean_text(part)]
    state = next((part for part in parts if part in KNOWN_STATES), None)
    district = next((part for part in parts if part in MAHARASHTRA_DISTRICTS), None)
    return location, district, state


def clean_job(job: ExternalJob) -> CleanJob:
    location, district, state = parse_location(job.location)
    dedupe_source = job.external_job_id or "|".join([
        clean_text(job.title) or "",
        clean_text(job.company) or "",
        location or "",
        job.source_url or "",
    ]).lower()
    dedupe_key = hashlib.sha256(dedupe_source.encode("utf-8")).hexdigest()
    return CleanJob({
        "title": clean_text(job.title) or "Untitled position",
        "company": clean_text(job.company),
        "location": location,
        "district": district,
        "state": state,
        "description": clean_text(job.description),
        "employment_type": clean_text(job.employment_type),
        "posted_date": job.posted_date,
        "source": clean_text(job.source) or "unknown",
        "source_url": job.source_url,
        "external_job_id": clean_text(job.external_job_id),
        "dedupe_key": dedupe_key,
        "skills": job.skills,
    })