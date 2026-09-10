from datetime import date, datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field


class JobResponse(BaseModel):
    id: int
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    description: Optional[str] = None
    employment_type: Optional[str] = None
    posted_date: Optional[date] = None
    source: str
    source_url: str
    external_job_id: Optional[str] = None
    skills: Optional[Any] = None
    created_at: datetime
    updated_at: datetime
    last_seen_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class JobListResponse(BaseModel):
    items: list[JobResponse]
    page: int
    page_size: int
    total: int


class JobStatsResponse(BaseModel):
    total_jobs: int
    active_jobs: int
    states: int
    districts: int
    latest_collection_at: Optional[datetime] = None


class LocationStatResponse(BaseModel):
    district: Optional[str] = None
    state: Optional[str] = None
    job_count: int


class CollectionResponse(BaseModel):
    source: str
    status: str
    jobs_fetched: int
    jobs_inserted: int
    jobs_updated: int
    duplicates_skipped: int
    errors: list[str] = Field(default_factory=list)
