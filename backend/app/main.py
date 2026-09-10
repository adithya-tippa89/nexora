from contextlib import asynccontextmanager
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.jobs import router as jobs_router
from app.routes.skills import router as skills_router
from app.routes.job_roles import router as job_roles_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup initialization and cleanup."""
    init_db()
    yield

app = FastAPI(
    title="SkillSync Maharashtra - Labour Market Intelligence Platform",
    description="""
    **Department of Skill Development, Employment and Entrepreneurship (DVET & MSSDS)**
    *Module 1: Authentication & User Management Engine*
    
    Features:
    * Secure Registration & Password Hashing (Bcrypt)
    * JWT Authentication (HS256)
    * Role-Based Access Control (RBAC): Student, Trainer, Employer, Admin
    * User Profiles & Protected Diagnostics
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount primary routes
app.include_router(auth_router)
app.include_router(users_router)

# Mount /api prefixed aliases for reverse-proxy compatibility
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(jobs_router)
app.include_router(jobs_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(job_roles_router, prefix="/api")

@app.get("/health", tags=["System"])
def health_check():
    """Service health verification."""
    return {
        "status": "UP",
        "service": "SkillSync Maharashtra Authentication & User Management (FastAPI)",
        "version": settings.APP_VERSION,
        "database": "PostgreSQL (SQLAlchemy)",
        "security": "JWT (HS256) + Bcrypt RBAC"
    }

@app.get("/", tags=["System"])
def root():
    return {
        "message": "SkillSync Maharashtra FastAPI Backend Running",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
