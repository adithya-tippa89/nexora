from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from app.auth.dependencies import require_role
from app.database import get_db
from app.models.job import Job
from app.models.skill import JobSkill, Skill
from app.schemas.skill import SkillCreate, SkillDemandResponse, SkillProcessResponse, SkillResponse
from app.services.skill_service import normalize_skill, process_unprocessed_jobs

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=list[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.name).all()


@router.post("", response_model=SkillResponse)
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    skill_name = payload.skill_name or payload.name
    if not skill_name or not skill_name.strip():
        raise HTTPException(status_code=400, detail="Skill name is required")
    name = skill_name.strip()
    normalized = normalize_skill(name).lower()
    existing = db.query(Skill).filter(Skill.normalized_name == normalized).first()
    if existing:
        return existing
    new_skill = Skill(
        name=name,
        normalized_name=normalized,
        category=payload.category or "General",
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill


@router.get("/demand", response_model=list[SkillDemandResponse])
def get_skill_demand(db: Session = Depends(get_db)):
    total_jobs = db.query(func.count(Job.id)).filter(Job.is_active.is_(True)).scalar() or 0
    rows = (
        db.query(Skill.name, Skill.category, func.count(distinct(JobSkill.job_id)).label("job_count"))
        .join(JobSkill, JobSkill.skill_id == Skill.id)
        .join(Job, Job.id == JobSkill.job_id)
        .filter(Job.is_active.is_(True))
        .group_by(Skill.id, Skill.name, Skill.category)
        .order_by(func.count(distinct(JobSkill.job_id)).desc(), Skill.name)
        .all()
    )
    return [SkillDemandResponse(skill=row.name, category=row.category, job_count=row.job_count, demand_percentage=round(row.job_count * 100 / total_jobs, 1) if total_jobs else 0) for row in rows]


@router.get("/jobs/{job_id}", response_model=list[SkillResponse])
def get_job_skills(job_id: int, db: Session = Depends(get_db)):
    return db.query(Skill).join(JobSkill, JobSkill.skill_id == Skill.id).filter(JobSkill.job_id == job_id).order_by(Skill.name).all()


@router.post("/process-existing", response_model=SkillProcessResponse, dependencies=[Depends(require_role("admin"))])
def process_existing_jobs(db: Session = Depends(get_db)):
    return process_unprocessed_jobs(db)