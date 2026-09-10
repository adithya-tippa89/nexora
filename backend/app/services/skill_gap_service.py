from sqlalchemy.orm import Session
from app.models.course import Course, CourseSkill
from app.models.job_role import JobRole, RoleSkill
from app.models.skill import Skill

IMPORTANCE_WEIGHTS = {"required": 1.0, "preferred": 0.75, "mentioned": 1.0}


def _weight(importance: str | None) -> float:
    return IMPORTANCE_WEIGHTS.get((importance or "mentioned").lower(), 1.0)


def analyze_skill_gap(db: Session, role_id: int, course_id: str) -> dict:
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise LookupError("Job role not found")
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise LookupError("Course not found")

    required_rows = db.query(RoleSkill, Skill).join(Skill, Skill.id == RoleSkill.skill_id).filter(RoleSkill.job_role_id == role.id).all()
    covered_ids = {row.skill_id for row in db.query(CourseSkill).filter(CourseSkill.course_id == course.id).all()}
    total_weight = sum(_weight(role_skill.importance) for role_skill, _ in required_rows)
    covered_weight = sum(_weight(role_skill.importance) for role_skill, skill in required_rows if skill.id in covered_ids)
    covered = []
    missing = []
    matrix = []
    for role_skill, skill in required_rows:
        is_covered = skill.id in covered_ids
        item = {
            "skill_id": skill.id,
            "skill_name": skill.name,
            "normalized_name": skill.normalized_name,
            "category": skill.category,
            "importance": role_skill.importance,
            "weight": _weight(role_skill.importance),
            "industry_demand": "Required" if role_skill.importance == "required" else "Mentioned",
            "proficiency_required": role_skill.importance.title(),
            "course_coverage": "Yes" if is_covered else "No",
            "gap_percentage": 0.0 if is_covered else 100.0,
            "reason": "Present in selected curriculum" if is_covered else "Required by industry role but not present in selected curriculum",
            "status": "Aligned" if is_covered else "Missing Gap",
        }
        matrix.append(item)
        (covered if is_covered else missing).append(item)
    coverage = round(covered_weight * 100 / total_weight, 1) if total_weight else 0.0
    return {
        "role_id": role.id,
        "job_role": role.name,
        "course_id": course.id,
        "course_name": course.course_name,
        "required_skills": [item["skill_name"] for item in matrix],
        "covered_skills": [item["skill_name"] for item in covered],
        "missing_skills": [item["skill_name"] for item in missing],
        "high_priority_missing_skills": [item["skill_name"] for item in sorted(missing, key=lambda item: item["weight"], reverse=True)],
        "total_required_skills": len(required_rows),
        "matching_skills_count": len(covered),
        "missing_skills_count": len(missing),
        "skill_match_percentage": coverage,
        "skill_coverage_percentage": coverage,
        "skill_gap_percentage": round(100 - coverage, 1) if total_weight else 0.0,
        "weighted": True,
        "calculation_explanation": "Coverage is the sum of covered role-skill weights divided by total required role-skill weights. Mentioned skills use equal weight because no stronger importance signal is available.",
        "matrix": matrix,
    }