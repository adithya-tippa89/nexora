"""Create collected jobs and collection runs tables."""
from alembic import op
import sqlalchemy as sa

revision = "002_create_jobs"
down_revision = "001_create_roles_and_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255)),
        sa.Column("location", sa.String(length=255)),
        sa.Column("district", sa.String(length=100)),
        sa.Column("state", sa.String(length=100)),
        sa.Column("description", sa.Text()),
        sa.Column("employment_type", sa.String(length=100)),
        sa.Column("posted_date", sa.Date()),
        sa.Column("source", sa.String(length=100), nullable=False),
        sa.Column("source_url", sa.String(length=1000), nullable=False),
        sa.Column("external_job_id", sa.String(length=255)),
        sa.Column("dedupe_key", sa.String(length=64), nullable=False),
        sa.Column("skills", sa.JSON()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.UniqueConstraint("source", "dedupe_key", name="uq_jobs_source_dedupe_key"),
    )
    for name, columns in {
        "ix_jobs_title": ["title"], "ix_jobs_company": ["company"], "ix_jobs_district": ["district"],
        "ix_jobs_state": ["state"], "ix_jobs_posted_date": ["posted_date"], "ix_jobs_source": ["source"],
        "ix_jobs_external_job_id": ["external_job_id"], "ix_jobs_is_active": ["is_active"],
    }.items():
        op.create_index(name, "jobs", columns)
    op.create_table(
        "job_collection_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source", sa.String(length=100), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("jobs_fetched", sa.Integer(), server_default="0", nullable=False),
        sa.Column("jobs_inserted", sa.Integer(), server_default="0", nullable=False),
        sa.Column("jobs_updated", sa.Integer(), server_default="0", nullable=False),
        sa.Column("duplicates_skipped", sa.Integer(), server_default="0", nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("error_message", sa.Text()),
    )
    op.create_index("ix_job_collection_runs_source", "job_collection_runs", ["source"])


def downgrade() -> None:
    op.drop_index("ix_job_collection_runs_source", table_name="job_collection_runs")
    op.drop_table("job_collection_runs")
    for name in ["ix_jobs_external_job_id", "ix_jobs_source", "ix_jobs_posted_date", "ix_jobs_state", "ix_jobs_district", "ix_jobs_company", "ix_jobs_title", "ix_jobs_is_active"]:
        op.drop_index(name, table_name="jobs")
    op.drop_table("jobs")