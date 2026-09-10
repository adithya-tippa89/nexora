import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database import Base
from app.models.job import Job
from app.models.skill import JobSkill, Skill
from app.models.job_role import JobRole, RoleSkill
from app.services.skill_service import extract_skills, process_job_skills
from app.services.job_role_service import process_job_role

skill_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
SkillSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=skill_engine)


@pytest.fixture(autouse=True)
def setup_skill_db():
    Base.metadata.create_all(bind=skill_engine)
    yield
    Base.metadata.drop_all(bind=skill_engine)


def test_skill_extraction_aliases_and_boundaries():
    assert set(extract_skills("Python, FastAPI, PostgreSQL and Git required.")) == {"Python", "FastAPI", "PostgreSQL", "Git"}
    assert set(extract_skills("Experience with Postgres DB and RESTful APIs.")) == {"PostgreSQL", "REST API"}
    assert extract_skills("Strong JavaScript skills.") == ["JavaScript"]
    assert set(extract_skills("React.js and Node JS experience.")) == {"React", "Node.js"}
    assert extract_skills("") == []


def test_job_skill_relationship_is_idempotent():
    db = SkillSessionLocal()
    job = Job(title="Engineer", source="test", source_url="https://example.test/skill", dedupe_key="skill", description="Python Python")
    db.add(job)
    db.commit()
    process_job_skills(db, job)
    db.commit()
    process_job_skills(db, job)
    db.commit()
    assert db.query(Skill).count() == 1
    assert db.query(JobSkill).count() == 1
    db.close()


def test_job_role_classification_links_normalized_skills_once():
    db = SkillSessionLocal()
    job = Job(title="Cloud Engineer", source="test", source_url="https://example.test/role", dedupe_key="role", description="AWS, Docker and Python")
    db.add(job)
    db.commit()
    process_job_skills(db, job)
    process_job_role(db, job)
    db.commit()
    process_job_role(db, job)
    db.commit()
    assert db.query(JobRole).one().name == "Cloud Engineer"
    assert db.query(RoleSkill).count() == 3
    db.close()