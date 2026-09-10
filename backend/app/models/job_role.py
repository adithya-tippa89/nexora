from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, text
from sqlalchemy.orm import relationship
from app.database import Base


class JobRole(Base):
    __tablename__ = "job_roles"
    __table_args__ = (UniqueConstraint("normalized_name", name="uq_job_roles_normalized_name"),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    normalized_name = Column(String(255), nullable=False, index=True)
    sector = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    jobs = relationship("Job", backref="job_role")
    role_skills = relationship("RoleSkill", back_populates="job_role", cascade="all, delete-orphan")


class RoleSkill(Base):
    __tablename__ = "role_skills"
    __table_args__ = (UniqueConstraint("job_role_id", "skill_id", name="uq_role_skills_role_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(String(20), nullable=False, default="mentioned")
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    job_role = relationship("JobRole", back_populates="role_skills")
    skill = relationship("Skill")