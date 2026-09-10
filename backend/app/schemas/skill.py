from datetime import datetime
from pydantic import BaseModel, ConfigDict


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