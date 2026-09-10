from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint, text
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        UniqueConstraint("source", "dedupe_key", name="uq_jobs_source_dedupe_key"),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=True, index=True)
    location = Column(String(255), nullable=True)
    district = Column(String(100), nullable=True, index=True)
    state = Column(String(100), nullable=True, index=True)
    description = Column(Text, nullable=True)
    employment_type = Column(String(100), nullable=True, index=True)
    posted_date = Column(Date, nullable=True, index=True)
    source = Column(String(100), nullable=False, index=True)
    source_url = Column(String(1000), nullable=False)
    external_job_id = Column(String(255), nullable=True, index=True)
    dedupe_key = Column(String(64), nullable=False)
    skills = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"), nullable=False)
    last_seen_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    skills_processed_at = Column(DateTime(timezone=True), nullable=True)
    role_processed_at = Column(DateTime(timezone=True), nullable=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)


class JobCollectionRun(Base):
    __tablename__ = "job_collection_runs"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(100), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    jobs_fetched = Column(Integer, default=0, nullable=False)
    jobs_inserted = Column(Integer, default=0, nullable=False)
    jobs_updated = Column(Integer, default=0, nullable=False)
    duplicates_skipped = Column(Integer, default=0, nullable=False)
    status = Column(String(30), nullable=False)
    error_message = Column(Text, nullable=True)
