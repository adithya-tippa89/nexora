from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from app.auth.dependencies import require_role
from app.database import get_db
from app.models.job import Job, JobCollectionRun
from app.models.skill import JobSkill, Skill
from app.schemas.job import CollectionResponse, JobListResponse, JobResponse, JobStatsResponse, LocationStatResponse
from app.services.job_collector import collect_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=JobListResponse)
def get_jobs(
    state: Optional[str] = None, district: Optional[str] = None, title: Optional[str] = None,
    company: Optional[str] = None, employment_type: Optional[str] = None, source: Optional[str] = None,
    posted_date: Optional[date] = None, page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Job).filter(Job.is_active.is_(True))
    for field, value in ((Job.state, state), (Job.district, district), (Job.title, title), (Job.company, company), (Job.employment_type, employment_type), (Job.source, source)):
        if value:
            query = query.filter(field.ilike(f"%{value}%"))
    if posted_date:
        query = query.filter(Job.posted_date == posted_date)
    total = query.count()
    items = query.order_by(Job.posted_date.desc().nullslast(), Job.updated_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return JobListResponse(items=items, page=page, page_size=page_size, total=total)


@router.get("/stats", response_model=JobStatsResponse)
def get_job_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Job.id)).scalar() or 0
    active = db.query(func.count(Job.id)).filter(Job.is_active.is_(True)).scalar() or 0
    states = db.query(func.count(distinct(Job.state))).filter(Job.state.isnot(None)).scalar() or 0
    districts = db.query(func.count(distinct(Job.district))).filter(Job.district.isnot(None)).scalar() or 0
    latest = db.query(func.max(JobCollectionRun.completed_at)).filter(JobCollectionRun.status == "success").scalar()
    return JobStatsResponse(total_jobs=total, active_jobs=active, states=states, districts=districts, latest_collection_at=latest)


@router.get("/stats/location", response_model=list[LocationStatResponse])
def get_location_stats(db: Session = Depends(get_db)):
    rows = db.query(Job.district, Job.state, func.count(Job.id).label("job_count")).filter(Job.is_active.is_(True)).group_by(Job.district, Job.state).order_by(func.count(Job.id).desc()).all()
    return [LocationStatResponse(district=row.district, state=row.state, job_count=row.job_count) for row in rows]


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}/skills")
def get_job_skills(job_id: int, db: Session = Depends(get_db)):
    return db.query(Skill).join(JobSkill, JobSkill.skill_id == Skill.id).filter(JobSkill.job_id == job_id).order_by(Skill.name).all()


@router.post("/collect", response_model=CollectionResponse, dependencies=[Depends(require_role("admin"))])
def collect_job_data(db: Session = Depends(get_db)):
    return collect_jobs(db)