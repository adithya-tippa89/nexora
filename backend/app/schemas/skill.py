from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SkillCreate(BaseModel):
    skill_name: str | None = None
    name: str | None = None
    category: str = "General"
    demand_score: float | None = None
    growth_rate: float | None = None
    velocity_status: str | None = None
    description: str | None = None


class SkillResponse(BaseModel):
    id: int
    name: str
    normalized_name: str
    category: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SkillDemandResponse(BaseModel):
    skill: str
    category: str
    job_count: int
    demand_percentage: float


class SkillProcessResponse(BaseModel):
    jobs_processed: int
    skills_extracted: int