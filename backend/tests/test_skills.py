import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database import Base
from app.models.job import Job
from app.models.skill import JobSkill, Skill
from app.models.job_role import JobRole, RoleSkill
from app.models.course import Course, CourseSkill
from app.services.skill_service import extract_skills, process_job_skills
from app.services.job_role_service import process_job_role
from app.services.skill_gap_service import analyze_skill_gap

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


def test_skill_gap_reports_covered_missing_and_weighted_percentages():
    db = SkillSessionLocal()
    role = JobRole(name="Software Developer", normalized_name="software developer", sector="Software")
    course = Course(id="course-gap", course_name="Test Curriculum")
    python = Skill(name="Python", normalized_name="python", category="Programming Language")
    sql = Skill(name="SQL", normalized_name="sql", category="Database")
    docker = Skill(name="Docker", normalized_name="docker", category="DevOps")
    db.add_all([role, course, python, sql, docker])
    db.commit()
    db.add_all([
        RoleSkill(job_role_id=role.id, skill_id=python.id, importance="required"),
        RoleSkill(job_role_id=role.id, skill_id=sql.id, importance="required"),
        RoleSkill(job_role_id=role.id, skill_id=docker.id, importance="preferred"),
        CourseSkill(course_id=course.id, skill_id=python.id),
        CourseSkill(course_id=course.id, skill_id=sql.id),
    ])
    db.commit()
    result = analyze_skill_gap(db, role.id, course.id)
    assert result["covered_skills"] == ["Python", "SQL"]
    assert result["missing_skills"] == ["Docker"]
    assert result["skill_coverage_percentage"] == 72.7
    assert result["skill_gap_percentage"] == 27.3
    assert result["high_priority_missing_skills"] == ["Docker"]
    assert "not present in selected curriculum" in result["matrix"][2]["reason"]
    db.close()


def test_skill_gap_empty_role_and_course_are_zero_not_fake():
    db = SkillSessionLocal()
    role = JobRole(name="Empty Role", normalized_name="empty role", sector="Other")
    course = Course(id="empty-course", course_name="Empty Course")
    db.add_all([role, course])
    db.commit()
    result = analyze_skill_gap(db, role.id, course.id)
    assert result["required_skills"] == []
    assert result["skill_coverage_percentage"] == 0.0
    assert result["skill_gap_percentage"] == 0.0
    db.close()


def test_skill_gap_rejects_unknown_role_or_course():
    db = SkillSessionLocal()
    with pytest.raises(LookupError, match="Job role not found"):
        analyze_skill_gap(db, 9999, "missing-course")
    db.add(JobRole(name="Known Role", normalized_name="known role", sector="Other"))
    db.commit()
    with pytest.raises(LookupError, match="Course not found"):
        analyze_skill_gap(db, 1, "missing-course")
    db.close()