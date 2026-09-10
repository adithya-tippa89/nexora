from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def build_engine():
    """
    Builds the SQLAlchemy engine.
    Tries configured DATABASE_URL with a fast connect timeout for PostgreSQL.
    If PostgreSQL is unreachable, falls back to a local SQLite database (sqlite:///./skillsync.db)
    to guarantee flawless zero-setup operation during local testing and development.
    """
    db_url = settings.DATABASE_URL
    connect_args = {}
    
    if db_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    elif "psycopg" in db_url:
        connect_args = {"connect_timeout": 2}

    try:
        eng = create_engine(
            db_url,
            pool_pre_ping=True,
            connect_args=connect_args
        )
        # Test connection
        with eng.connect() as conn:
            pass
        logger.info(f"Connected to primary database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
        return eng
    except Exception as exc:
        if not db_url.startswith("sqlite"):
            fallback_url = "sqlite:///./skillsync.db"
            logger.warning(
                f"Configured PostgreSQL database is not reachable ({exc}). "
                f"Gracefully falling back to local SQLite at '{fallback_url}'."
            )
            return create_engine(
                fallback_url,
                connect_args={"check_same_thread": False}
            )
        raise exc

engine = build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI dependency that yields a SQLAlchemy database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Idempotent database initialization:
    1. Creates all tables registered on Base.metadata.
    2. Seeds the 4 default system roles ('student', 'trainer', 'employer', 'admin').
    3. Seeds default demo users with verified passwords for evaluation.
    """
    from app.models.role import Role
    from app.models.user import User
    from app.models.job import Job, JobCollectionRun

    try:
        Base.metadata.create_all(bind=engine)
        
        db: Session = SessionLocal()
        try:
            default_roles = ["student", "trainer", "employer", "admin"]
            for role_name in default_roles:
                existing = db.query(Role).filter(Role.name == role_name).first()
                if not existing:
                    role = Role(name=role_name)
                    db.add(role)
            db.commit()

            roles_map = {r.name: r for r in db.query(Role).all()}
            demo_users = [
                {
                    "email": "admin@maharashtra.gov.in",
                    "name": "Dr. Rajeshwar Patil",
                    "role": "admin",
                    "district": "Mumbai Suburban",
                    "organization": "Directorate of Vocational Education and Training (DVET)",
                    "password": "password123"
                },
                {
                    "email": "institute@coep.ac.in",
                    "name": "Prof. Sunita Deshmukh",
                    "role": "trainer",
                    "district": "Pune",
                    "organization": "Government Polytechnic Pune & Skill Hub",
                    "password": "password123"
                },
                {
                    "email": "recruitment@tatamotors.com",
                    "name": "Anand Kulkarni",
                    "role": "employer",
                    "district": "Pune",
                    "organization": "Tata Motors Innovation Labs",
                    "password": "password123"
                },
                {
                    "email": "rohan.shinde@student.ac.in",
                    "name": "Rohan Shinde",
                    "role": "student",
                    "district": "Pune",
                    "organization": "B.Tech Computer Science (Final Year)",
                    "password": "password123"
                }
            ]

            from app.auth.password import hash_password
            for u_data in demo_users:
                user_exists = db.query(User).filter(User.email == u_data["email"]).first()
                if not user_exists and u_data["role"] in roles_map:
                    new_u = User(
                        name=u_data["name"],
                        email=u_data["email"],
                        password_hash=hash_password(u_data["password"]),
                        role_id=roles_map[u_data["role"]].id,
                        district=u_data["district"],
                        organization=u_data["organization"],
                        is_active=True
                    )
                    db.add(new_u)
            db.commit()
            logger.info("Default roles and demo accounts successfully checked/seeded.")
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Could not complete database initialization: {e}")
