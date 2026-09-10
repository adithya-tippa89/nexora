from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.auth.dependencies import get_current_active_user, require_role

router = APIRouter(prefix="/users", tags=["Users & Profiles"])

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile"
)
def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Returns the profile information of the currently authenticated user.
    Requires a valid JWT Bearer token.
    Never exposes passwords, hashes, or secrets.
    """
    role_name = current_user.role.name if current_user.role else "student"
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=role_name,
        district=current_user.district,
        organization=current_user.organization,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current authenticated user profile"
)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update profile attributes (name, district, organization) for the current authenticated user.
    """
    if user_update.name is not None:
        current_user.name = user_update.name.strip()
    if user_update.district is not None:
        current_user.district = user_update.district.strip()
    if user_update.organization is not None:
        current_user.organization = user_update.organization.strip()

    db.commit()
    db.refresh(current_user)

    role_name = current_user.role.name if current_user.role else "student"
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=role_name,
        district=current_user.district,
        organization=current_user.organization,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

# -------------------------------------------------------------
# Role-Protected Verification Endpoints (RBAC Testing)
# -------------------------------------------------------------

@router.get(
    "/admin-only",
    summary="Admin-only protected route"
)
def admin_only_action(
    current_user: User = Depends(require_role("admin"))
):
    """Accessible exclusively by users with the 'admin' role. Returns 403 otherwise."""
    return {
        "message": f"Welcome Administrator {current_user.name}. You have state-wide administrative authority.",
        "user_id": current_user.id,
        "role": current_user.role.name
    }

@router.get(
    "/trainer-only",
    summary="Trainer / Faculty protected route"
)
def trainer_only_action(
    current_user: User = Depends(require_role("trainer"))
):
    """Accessible exclusively by users with the 'trainer' role."""
    return {
        "message": f"Welcome Trainer {current_user.name}. Faculty development portal accessible.",
        "user_id": current_user.id,
        "role": current_user.role.name
    }

@router.get(
    "/employer-only",
    summary="Employer protected route"
)
def employer_only_action(
    current_user: User = Depends(require_role("employer"))
):
    """Accessible exclusively by users with the 'employer' role."""
    return {
        "message": f"Welcome Industry Partner {current_user.name}. Talent acquisition dashboard accessible.",
        "user_id": current_user.id,
        "role": current_user.role.name
    }

@router.get(
    "/student-only",
    summary="Student protected route"
)
def student_only_action(
    current_user: User = Depends(require_role("student"))
):
    """Accessible exclusively by users with the 'student' role."""
    return {
        "message": f"Welcome Candidate {current_user.name}. Personalized learning pathway active.",
        "user_id": current_user.id,
        "role": current_user.role.name
    }
