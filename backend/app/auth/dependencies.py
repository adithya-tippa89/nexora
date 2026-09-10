from typing import Union, List
# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    description="JWT Bearer Token Authorization"
)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate the currently authenticated user from the JWT token."""
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        uid = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid subject format in token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(User.id == uid).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found for provided token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure the authenticated user's account is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    return current_user

def require_role(allowed_roles: Union[str, List[str]]):
    """
    Role-Based Access Control (RBAC) Dependency Factory.
    Enforces that the current authenticated user has one of the allowed roles.
    Returns HTTP 403 Forbidden if permissions are insufficient.
    """
    if isinstance(allowed_roles, str):
        roles_set = {allowed_roles.lower()}
    else:
        roles_set = {r.lower() for r in allowed_roles}

    def role_dependency(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        user_role = current_user.role.name.lower() if current_user.role else ""
        if user_role not in roles_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Operation requires {list(roles_set)} permission. Current role is '{user_role}'."
            )
        return current_user

    return role_dependency
