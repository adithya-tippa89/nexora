from typing import Optional
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

VALID_PUBLIC_ROLES = {"student", "trainer", "employer", "institution"}

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account"
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new student, trainer, or employer account.
    - Validates inputs using Pydantic.
    - Prohibits public registration as admin.
    - Checks email uniqueness.
    - Hashes password securely before storing.
    - Returns safe user response without password or hash.
    """
    normalized_role = user_in.role.lower().strip()

    # Security check: Prevent public admin registration
    if normalized_role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Public registration as admin is prohibited. Admin accounts must be provisioned internally."
        )

    # Normalize 'institution' to 'trainer'
    if normalized_role == "institution":
        normalized_role = "trainer"

    if normalized_role not in {"student", "trainer", "employer"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{user_in.role}'. Allowed roles for registration are: student, trainer, employer."
        )

    # Check if email is already taken
    existing_user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Fetch role entity
    role_entity = db.query(Role).filter(Role.name == normalized_role).first()
    if not role_entity:
        role_entity = Role(name=normalized_role)
        db.add(role_entity)
        db.commit()
        db.refresh(role_entity)

    # Hash password securely
    hashed_pwd = hash_password(user_in.password)

    new_user = User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        password_hash=hashed_pwd,
        role_id=role_entity.id,
        district=user_in.district,
        organization=user_in.organization,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=role_entity.name,
        district=new_user.district,
        organization=new_user.organization,
        is_active=new_user.is_active,
        created_at=new_user.created_at,
        updated_at=new_user.updated_at
    )

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive a JWT access token"
)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with email and password.
    Supports both standard JSON payload (`{"email": "...", "password": "..."}`)
    and standard OAuth2 Form URL-Encoded payload (`username=...&password=...`) for Swagger UI.
    """
    content_type = request.headers.get("content-type", "")
    email: Optional[str] = None
    password: Optional[str] = None

    if "application/json" in content_type:
        try:
            body = await request.json()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Malformed or invalid JSON payload."
            )
        email = body.get("email") or body.get("username")
        password = body.get("password")
    else:
        # Form url-encoded (standard OAuth2 password grant in Swagger UI)
        form = await request.form()
        email = form.get("username") or form.get("email")
        password = form.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/username and password are required."
        )

    # Find user by email
    user = db.query(User).filter(User.email == email.lower().strip()).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account has been deactivated."
        )

    role_name = user.role.name if user.role else "student"

    # Create JWT access token
    token_payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": role_name
    }
    access_token = create_access_token(token_payload)

    user_data = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=role_name,
        district=user.district,
        organization=user.organization,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_data
    )
