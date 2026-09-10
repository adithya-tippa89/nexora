import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.course import Course, CourseSkill
from app.models.skill import Skill
from app.services.skill_service import SKILL_CATALOG, normalize_skill

logger = logging.getLogger(__name__)
COURSE_DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "courses.json"


def course_skill_names(value: str) -> list[str]:
    known = []
    lowered = value.lower()
    for canonical, (_, aliases) in SKILL_CATALOG.items():
        if any(re.search(r"(?<![\w+#])" + re.escape(candidate.lower()) + r"(?![\w+#])", lowered) for candidate in [canonical, *aliases]):
            known.append(canonical)
    return known or [normalize_skill(value)]


def get_or_create_skill(db: Session, name: str) -> Skill:
    canonical = normalize_skill(name)
    normalized_name = canonical.lower()
    skill = db.query(Skill).filter(Skill.normalized_name == normalized_name).first()
    if not skill:
        category = SKILL_CATALOG.get(canonical, ("Other", []))[0]
        skill = Skill(name=canonical, normalized_name=normalized_name, category=category)
        db.add(skill)
        db.flush()
    return skill


def seed_courses(db: Session) -> int:
    if not COURSE_DATA_PATH.exists():
        logger.warning("Course seed file not found: %s", COURSE_DATA_PATH)
        return 0
    records = json.loads(COURSE_DATA_PATH.read_text(encoding="utf-8-sig"))
    created = 0
    for record in records:
        course = db.query(Course).filter(Course.id == record["id"]).first()
        if not course:
            course = Course(**{key: record.get(key) for key in ("id", "course_name", "institution_name", "sector", "district", "duration", "placement_rate", "enrollment_count", "industry_match_score", "status")}, created_at=datetime.now(timezone.utc))
            db.add(course)
            db.flush()
            created += 1
        for raw_name in record.get("skills_covered", []):
            for name in course_skill_names(raw_name):
                skill = get_or_create_skill(db, name)
                if not db.query(CourseSkill).filter(CourseSkill.course_id == course.id, CourseSkill.skill_id == skill.id).first():
                    db.add(CourseSkill(course_id=course.id, skill_id=skill.id, coverage_level="mentioned"))
    db.commit()
    return created