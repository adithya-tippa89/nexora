"""Create job roles and role skill relationships."""
from alembic import op
import sqlalchemy as sa

revision = "004_create_job_roles"
down_revision = "003_create_skills"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    job_columns = {column["name"] for column in sa.inspect(bind).get_columns("jobs")}
    if "role_processed_at" not in job_columns:
        op.add_column("jobs", sa.Column("role_processed_at", sa.DateTime(timezone=True), nullable=True))
    if "job_role_id" not in job_columns:
        op.add_column("jobs", sa.Column("job_role_id", sa.Integer(), nullable=True))
    op.create_index("ix_jobs_role_processed_at", "jobs", ["role_processed_at"])
    op.create_index("ix_jobs_job_role_id", "jobs", ["job_role_id"])
    op.create_table(
        "job_roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("normalized_name", sa.String(length=255), nullable=False),
        sa.Column("sector", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("normalized_name", name="uq_job_roles_normalized_name"),
    )
    op.create_index("ix_job_roles_normalized_name", "job_roles", ["normalized_name"])
    op.create_index("ix_job_roles_sector", "job_roles", ["sector"])
    if bind.dialect.name != "sqlite":
        op.create_foreign_key("fk_jobs_job_role_id", "jobs", "job_roles", ["job_role_id"], ["id"], ondelete="SET NULL")
    op.create_table(
        "role_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("job_role_id", sa.Integer(), sa.ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id", ondelete="CASCADE"), nullable=False),
        sa.Column("importance", sa.String(length=20), nullable=False, server_default="mentioned"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("job_role_id", "skill_id", name="uq_role_skills_role_skill"),
    )
    op.create_index("ix_role_skills_role_id", "role_skills", ["job_role_id"])
    op.create_index("ix_role_skills_skill_id", "role_skills", ["skill_id"])


def downgrade() -> None:
    op.drop_index("ix_role_skills_skill_id", table_name="role_skills")
    op.drop_index("ix_role_skills_role_id", table_name="role_skills")
    op.drop_table("role_skills")
    if op.get_bind().dialect.name != "sqlite":
        op.drop_constraint("fk_jobs_job_role_id", "jobs", type_="foreignkey")
    op.drop_index("ix_job_roles_sector", table_name="job_roles")
    op.drop_index("ix_job_roles_normalized_name", table_name="job_roles")
    op.drop_table("job_roles")
    op.drop_index("ix_jobs_job_role_id", table_name="jobs")
    op.drop_index("ix_jobs_role_processed_at", table_name="jobs")
    op.drop_column("jobs", "job_role_id")
    op.drop_column("jobs", "role_processed_at")