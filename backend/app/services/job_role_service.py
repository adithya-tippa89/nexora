import logging
import re
from datetime import datetime, timedelta, timezone
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.job_role import JobRole, RoleSkill
from app.models.skill import JobSkill, Skill

logger = logging.getLogger(__name__)

ROLE_CATALOG = {
    "Software Developer": ("Software & IT", ["software developer", "software engineer", "application developer"]),
    "Data Analyst": ("Data & Analytics", ["data analyst", "business analyst", "data analytics"]),
    "Cybersecurity Analyst": ("Cybersecurity", ["cybersecurity analyst", "cyber security analyst", "security analyst"]),
    "EV Technician": ("Automotive & EV", ["ev technician", "electric vehicle technician", "automotive technician"]),
    "Cloud Engineer": ("Cloud & Infrastructure", ["cloud engineer", "cloud developer", "devops engineer"]),
    "AI Engineer": ("AI & Machine Learning", ["ai engineer", "artificial intelligence engineer", "machine learning engineer"]),
    "Digital Marketing Specialist": ("Digital Marketing", ["digital marketing specialist", "digital marketing executive", "marketing specialist"]),
}


def normalize_role(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()
    for canonical, (_, aliases) in ROLE_CATALOG.items():
        names = [canonical, *aliases]
        if normalized in [re.sub(r"[^a-z0-9]+", " ", name.lower()).strip() for name in names]:
            return canonical
    return value.strip()


def classify_job_role(job: Job) -> str | None:
    text = f"{job.title or ''} {job.description or ''}".lower()
    matches = []
    for role, (_, aliases) in ROLE_CATALOG.items():
        for alias in aliases:
            if re.search(r"(?<![\w])" + re.escape(alias) + r"(?![\w])", text):
                matches.append((len(alias), role))
    return max(matches)[1] if matches else None


def process_job_role(db: Session, job: Job) -> bool:
    role_name = classify_job_role(job)
    if not role_name:
        job.role_processed_at = datetime.now(timezone.utc)
        return False
    sector, aliases = ROLE_CATALOG[role_name]
    normalized_name = normalize_role(role_name).lower()
    role = db.query(JobRole).filter(JobRole.normalized_name == normalized_name).first()
    if not role:
        role = JobRole(name=role_name, normalized_name=normalized_name, sector=sector, description=f"{role_name} roles in {sector}.", created_at=datetime.now(timezone.utc))
        db.add(role)
        db.flush()
    job.job_role_id = role.id
    for job_skill in db.query(JobSkill).filter(JobSkill.job_id == job.id).all():
        exists = db.query(RoleSkill).filter(RoleSkill.job_role_id == role.id, RoleSkill.skill_id == job_skill.skill_id).first()
        if not exists:
            db.add(RoleSkill(job_role_id=role.id, skill_id=job_skill.skill_id, importance=job_skill.importance, created_at=datetime.now(timezone.utc)))
    db.flush()
    job.role_processed_at = datetime.now(timezone.utc)
    return True


def process_unprocessed_roles(db: Session) -> dict:
    jobs = db.query(Job).filter(Job.role_processed_at.is_(None)).all()
    processed = classified = 0
    for job in jobs:
        try:
            classified += int(process_job_role(db, job))
            processed += 1
        except Exception:
            logger.exception("Role processing failed for job %s", job.id)
    db.commit()
    return {"jobs_processed": processed, "roles_classified": classified}


def role_payload(db: Session, role: JobRole) -> dict:
    total = db.query(func.count(Job.id)).filter(Job.is_active.is_(True)).scalar() or 0
    jobs = db.query(Job).filter(Job.job_role_id == role.id, Job.is_active.is_(True))
    count = jobs.count()
    recent_cutoff = datetime.now(timezone.utc) - timedelta(days=90)
    recent = jobs.filter(Job.created_at >= recent_cutoff).count()
    older = jobs.filter(Job.created_at < recent_cutoff).count()
    locations = db.query(Job.district, Job.state, func.count(Job.id).label("job_count")).filter(Job.job_role_id == role.id, Job.is_active.is_(True)).group_by(Job.district, Job.state).order_by(func.count(Job.id).desc()).limit(10).all()
    skills = db.query(Skill, func.count(distinct(JobSkill.job_id)).label("job_count")).join(RoleSkill, RoleSkill.skill_id == Skill.id).join(JobSkill, JobSkill.skill_id == Skill.id).join(Job, Job.id == JobSkill.job_id).filter(RoleSkill.job_role_id == role.id, Job.job_role_id == role.id).group_by(Skill.id).order_by(func.count(distinct(JobSkill.job_id)).desc()).limit(12).all()
    return {
        "id": role.id, "role_name": role.name, "sector": role.sector, "description": role.description,
        "open_vacancies": count, "demand_percentage": round(count * 100 / total, 1) if total else 0,
        "demand_score": round(count * 100 / total) if total else 0,
        "trend": "rising" if recent > older else "stable" if recent == older else "declining",
        "growth_rate": round((recent - older) * 100 / older, 1) if older else 0,
        "locations": [{"district": row.district, "state": row.state, "job_count": row.job_count} for row in locations],
        "skills": [{"skill_name": skill.name, "category": skill.category, "job_count": job_count, "proficiency_level": "required"} for skill, job_count in skills],
    }