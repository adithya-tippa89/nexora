"""Create normalized skills and job skill relationships."""
from alembic import op
import sqlalchemy as sa

revision = "003_create_skills"
down_revision = "002_create_jobs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    job_columns = {column["name"] for column in sa.inspect(bind).get_columns("jobs")}
    if "skills_processed_at" not in job_columns:
        op.add_column("jobs", sa.Column("skills_processed_at", sa.DateTime(timezone=True), nullable=True))
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("normalized_name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("normalized_name", name="uq_skills_normalized_name"),
    )
    op.create_index("ix_skills_normalized_name", "skills", ["normalized_name"])
    op.create_index("ix_skills_category", "skills", ["category"])
    op.create_table(
        "job_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id", ondelete="CASCADE"), nullable=False),
        sa.Column("importance", sa.String(length=20), nullable=False, server_default="mentioned"),
        sa.Column("source", sa.String(length=50), nullable=False, server_default="rule_based"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("job_id", "skill_id", name="uq_job_skills_job_skill"),
    )
    op.create_index("ix_job_skills_job_id", "job_skills", ["job_id"])
    op.create_index("ix_job_skills_skill_id", "job_skills", ["skill_id"])


def downgrade() -> None:
    op.drop_index("ix_job_skills_skill_id", table_name="job_skills")
    op.drop_index("ix_job_skills_job_id", table_name="job_skills")
    op.drop_table("job_skills")
    op.drop_index("ix_skills_category", table_name="skills")
    op.drop_index("ix_skills_normalized_name", table_name="skills")
    op.drop_table("skills")
    op.drop_column("jobs", "skills_processed_at")