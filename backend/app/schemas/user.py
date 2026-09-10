from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class RoleResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full name")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, max_length=100, description="User password (min 6 characters)")
    role: str = Field("student", description="Role: 'student', 'trainer', or 'employer'")
    district: Optional[str] = Field("Pune", max_length=100)
    organization: Optional[str] = Field(None, max_length=255)

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    district: Optional[str] = Field(None, max_length=100)
    organization: Optional[str] = Field(None, max_length=255)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    district: Optional[str] = None
    organization: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
