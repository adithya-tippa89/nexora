from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, text
from sqlalchemy.orm import relationship
from app.database import Base


class Skill(Base):
    __tablename__ = "skills"
    __table_args__ = (UniqueConstraint("normalized_name", name="uq_skills_normalized_name"),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    normalized_name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    job_skills = relationship("JobSkill", back_populates="skill", cascade="all, delete-orphan")


class JobSkill(Base):
    __tablename__ = "job_skills"
    __table_args__ = (UniqueConstraint("job_id", "skill_id", name="uq_job_skills_job_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(String(20), nullable=False, default="mentioned")
    source = Column(String(50), nullable=False, default="rule_based")
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    skill = relationship("Skill", back_populates="job_skills")