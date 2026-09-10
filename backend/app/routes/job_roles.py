from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.auth.dependencies import require_role
from app.database import get_db
from app.models.job_role import JobRole
from app.services.job_role_service import process_unprocessed_roles, role_payload

router = APIRouter(prefix="/job-roles", tags=["Job Roles"])


@router.get("")
def get_job_roles(sector: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(JobRole).order_by(JobRole.name)
    if sector and sector.lower() != "all":
        query = query.filter(JobRole.sector.ilike(f"%{sector}%"))
    if search:
        query = query.filter(JobRole.name.ilike(f"%{search}%"))
    roles = query.all()
    return {"job_roles": [role_payload(db, role) for role in roles], "sectors": [row[0] for row in db.query(JobRole.sector).distinct().order_by(JobRole.sector).all()], "total": len(roles)}


@router.get("/{role_id}")
def get_job_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")
    return role_payload(db, role)


@router.post("/process-existing", dependencies=[Depends(require_role("admin"))])
def process_existing_job_roles(db: Session = Depends(get_db)):
    return process_unprocessed_roles(db)