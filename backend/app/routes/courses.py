from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.course import Course, CourseSkill
from app.models.skill import Skill
from app.services.course_service import course_skill_names, get_or_create_skill

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).order_by(Course.course_name).all()
    return {"courses": [{"id": course.id, "course_name": course.course_name, "institution_name": course.institution_name, "sector": course.sector, "district": course.district, "skills_covered": [skill.name for skill in db.query(Skill).join(CourseSkill, CourseSkill.skill_id == Skill.id).filter(CourseSkill.course_id == course.id).order_by(Skill.name).all()]} for course in courses], "total": len(courses)}


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"id": course.id, "course_name": course.course_name, "institution_name": course.institution_name, "sector": course.sector, "district": course.district, "skills_covered": [skill.name for skill in db.query(Skill).join(CourseSkill, CourseSkill.skill_id == Skill.id).filter(CourseSkill.course_id == course.id).all()]}


@router.patch("/{course_id}/skills")
def update_course_skills(course_id: str, payload: dict, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    added_skills = payload.get("added_skills", [])
    if not isinstance(added_skills, list) or not all(isinstance(skill, str) and skill.strip() for skill in added_skills):
        raise HTTPException(status_code=422, detail="added_skills must be a list of non-empty strings")
    for raw_name in added_skills:
        for name in course_skill_names(raw_name):
            skill = get_or_create_skill(db, name)
            if not db.query(CourseSkill).filter(CourseSkill.course_id == course.id, CourseSkill.skill_id == skill.id).first():
                db.add(CourseSkill(course_id=course.id, skill_id=skill.id, coverage_level="mentioned"))
    db.commit()
    return {"success": True, "course_id": course.id, "skills_added": added_skills}