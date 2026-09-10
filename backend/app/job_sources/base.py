from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class ExternalJob:
    title: str
    company: Optional[str]
    location: Optional[str]
    description: Optional[str]
    employment_type: Optional[str]
    posted_date: Optional[date]
    source: str
    source_url: str
    external_job_id: Optional[str]
    skills: Optional[list[str]] = None


class JobSourceAdapter(ABC):
    name: str

    @abstractmethod
    def fetch_jobs(self) -> list[ExternalJob]:
        raise NotImplementedError
