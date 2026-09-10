import logging
import re
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.skill import JobSkill, Skill
from app.services.job_role_service import process_job_role

logger = logging.getLogger(__name__)

SKILL_CATALOG = {
    "Python": ("Programming Language", ["python"]),
    "Java": ("Programming Language", ["java"]),
    "JavaScript": ("Programming Language", ["javascript", "java script"]),
    "C++": ("Programming Language", ["c++", "cpp"]),
    "C": ("Programming Language", ["c"]),
    "Go": ("Programming Language", ["golang"]),
    "PHP": ("Programming Language", ["php"]),
    "FastAPI": ("Framework", ["fastapi"]),
    "Django": ("Framework", ["django"]),
    "Flask": ("Framework", ["flask"]),
    "React": ("Framework", ["react", "reactjs", "react.js", "react js"]),
    "React Native": ("Framework", ["react native", "react-native"]),
    "Angular": ("Framework", ["angular"]),
    "Spring Boot": ("Framework", ["spring boot"]),
    "Node.js": ("Framework", ["node", "nodejs", "node.js", "node js"]),
    "Express": ("Framework", ["express", "express.js"]),
    "PostgreSQL": ("Database", ["postgres", "postgresql", "postgres db", "postgresql database"]),
    "MySQL": ("Database", ["mysql"]),
    "MongoDB": ("Database", ["mongo", "mongodb"]),
    "SQLite": ("Database", ["sqlite"]),
    "Redis": ("Database", ["redis"]),
    "Git": ("Tool", ["git"]),
    "GitHub": ("Tool", ["github"]),
    "Docker": ("DevOps", ["docker"]),
    "Kubernetes": ("DevOps", ["kubernetes", "k8s"]),
    "Jenkins": ("DevOps", ["jenkins"]),
    "REST API": ("API", ["rest api", "rest apis", "restful api", "restful apis"]),
    "Microservices": ("Concept", ["microservices", "microservice"]),
    "Machine Learning": ("AI/ML", ["machine learning", "ml"]),
    "Data Structures": ("Concept", ["data structures", "data structure"]),
    "Algorithms": ("Concept", ["algorithms", "algorithm"]),
    "SQL": ("Database", ["sql"]),
    "AWS": ("Cloud", ["aws", "amazon web services"]),
    "Azure": ("Cloud", ["azure"]),
    "Google Cloud": ("Cloud", ["google cloud", "gcp"]),
}


def normalize_skill(value: str) -> str:
    normalized = re.sub(r"[._-]+", " ", value.lower())
    normalized = re.sub(r"\s+", " ", normalized).strip()
    for canonical, (_, aliases) in SKILL_CATALOG.items():
        names = [canonical, *aliases]
        if normalized in [re.sub(r"[._-]+", " ", name.lower()) for name in names]:
            return canonical
    return value.strip()


def extract_skills(description: str | None) -> list[str]:
    if not description:
        logger.info("Skipping skill extraction for empty job description")
        return []
    text = re.sub(r"<[^>]+>", " ", description.lower())
    text = re.sub(r"\s+", " ", text)
    found = []
    for canonical, (_, aliases) in SKILL_CATALOG.items():
        candidates = [canonical, *aliases]
        if any(re.search(r"(?<![\w+#])" + re.escape(candidate.lower()) + r"(?![\w+#])", text) for candidate in candidates):
            found.append(canonical)
    return found


def process_job_skills(db: Session, job: Job) -> int:
    skills = extract_skills(job.description)
    db.query(JobSkill).filter(JobSkill.job_id == job.id).delete(synchronize_session=False)
    for name in skills:
        category = SKILL_CATALOG[name][0]
        normalized_name = normalize_skill(name).lower()
        skill = db.query(Skill).filter(Skill.normalized_name == normalized_name).first()
        if not skill:
            skill = Skill(name=name, normalized_name=normalized_name, category=category, created_at=datetime.now(timezone.utc))
            db.add(skill)
            db.flush()
        exists = db.query(JobSkill).filter(JobSkill.job_id == job.id, JobSkill.skill_id == skill.id).first()
        if not exists:
            db.add(JobSkill(job_id=job.id, skill_id=skill.id, importance="mentioned", source="rule_based", created_at=datetime.now(timezone.utc)))
    job.skills_processed_at = datetime.now(timezone.utc)
    logger.info("Processed job %s: extracted %s skills", job.id, len(skills))
    return len(skills)


def process_unprocessed_jobs(db: Session) -> dict:
    skill_jobs = db.query(Job).filter(Job.skills_processed_at.is_(None)).all()
    role_jobs = db.query(Job).filter(Job.role_processed_at.is_(None)).all()
    processed = extracted = roles_classified = 0
    for job in skill_jobs:
        try:
            extracted += process_job_skills(db, job)
            processed += 1
        except Exception:
            logger.exception("Skill processing failed for job %s", job.id)
    for job in role_jobs:
        try:
            roles_classified += int(process_job_role(db, job))
        except Exception:
            logger.exception("Role processing failed for job %s", job.id)
    db.commit()
    return {"jobs_processed": max(processed, len(role_jobs)), "skills_extracted": extracted, "roles_classified": roles_classified}