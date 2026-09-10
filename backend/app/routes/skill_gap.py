from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.skill_gap_service import analyze_skill_gap

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap Analysis"])


def _run(role_id: int, course_id: str, db: Session):
    try:
        return {"analysis": analyze_skill_gap(db, role_id, course_id)}
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/role/{role_id}")
def analyze_role(role_id: int, course_id: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return _run(role_id, course_id, db)


@router.get("/course/{course_id}")
def analyze_course(course_id: str, role_id: int = Query(..., ge=1), db: Session = Depends(get_db)):
    return _run(role_id, course_id, db)


@router.get("/analyze")
def analyze_get(role_id: int = Query(..., ge=1), course_id: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return _run(role_id, course_id, db)


@router.post("/analyze")
def analyze_post(payload: dict, db: Session = Depends(get_db)):
    role_id = payload.get("role_id") or payload.get("job_role_id")
    course_id = payload.get("course_id")
    if not isinstance(role_id, int) or not isinstance(course_id, str) or not course_id.strip():
        raise HTTPException(status_code=422, detail="role_id and course_id are required")
    return _run(role_id, course_id, db)