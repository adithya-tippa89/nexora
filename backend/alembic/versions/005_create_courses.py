"""Create persisted course curricula and course skill relationships."""
from alembic import op
import sqlalchemy as sa

revision = "005_create_courses"
down_revision = "004_create_job_roles"
branch_labels = None
depends_on = None


def upgrade() -> None:
    tables = set(sa.inspect(op.get_bind()).get_table_names())
    if "courses" not in tables:
        op.create_table(
            "courses",
            sa.Column("id", sa.String(length=100), primary_key=True),
            sa.Column("course_name", sa.String(length=255), nullable=False),
            sa.Column("institution_name", sa.String(length=255)),
            sa.Column("sector", sa.String(length=100)),
            sa.Column("district", sa.String(length=100)),
            sa.Column("duration", sa.String(length=50)),
            sa.Column("placement_rate", sa.Float()),
            sa.Column("enrollment_count", sa.Integer()),
            sa.Column("industry_match_score", sa.Float()),
            sa.Column("status", sa.String(length=100)),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        )
        op.create_index("ix_courses_sector", "courses", ["sector"])
        op.create_index("ix_courses_district", "courses", ["district"])
    if "course_skills" not in tables:
        op.create_table(
            "course_skills",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("course_id", sa.String(length=100), sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
            sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id", ondelete="CASCADE"), nullable=False),
            sa.Column("coverage_level", sa.String(length=30), nullable=False, server_default="mentioned"),
            sa.UniqueConstraint("course_id", "skill_id", name="uq_course_skills_course_skill"),
        )
        op.create_index("ix_course_skills_course_id", "course_skills", ["course_id"])
        op.create_index("ix_course_skills_skill_id", "course_skills", ["skill_id"])


def downgrade() -> None:
    op.drop_index("ix_course_skills_skill_id", table_name="course_skills")
    op.drop_index("ix_course_skills_course_id", table_name="course_skills")
    op.drop_table("course_skills")
    op.drop_index("ix_courses_district", table_name="courses")
    op.drop_index("ix_courses_sector", table_name="courses")
    op.drop_table("courses")