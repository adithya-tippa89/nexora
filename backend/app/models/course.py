from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint, text
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(String(100), primary_key=True)
    course_name = Column(String(255), nullable=False)
    institution_name = Column(String(255), nullable=True)
    sector = Column(String(100), nullable=True, index=True)
    district = Column(String(100), nullable=True, index=True)
    duration = Column(String(50), nullable=True)
    placement_rate = Column(Float, nullable=True)
    enrollment_count = Column(Integer, nullable=True)
    industry_match_score = Column(Float, nullable=True)
    status = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    course_skills = relationship("CourseSkill", back_populates="course", cascade="all, delete-orphan")


class CourseSkill(Base):
    __tablename__ = "course_skills"
    __table_args__ = (UniqueConstraint("course_id", "skill_id", name="uq_course_skills_course_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String(100), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    coverage_level = Column(String(30), nullable=False, default="mentioned")
    course = relationship("Course", back_populates="course_skills")
    skill = relationship("Skill")