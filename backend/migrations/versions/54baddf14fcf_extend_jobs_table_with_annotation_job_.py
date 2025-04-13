"""
extend jobs table with annotation job specific json field

Revision ID: 54baddf14fcf
Revises: b28c0bcf638d
Create Date: 2025-04-13 15:31:34.867593

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '54baddf14fcf'
down_revision: str | None = 'b28c0bcf638d'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""ALTER TABLE Jobs ADD
               COLUMN job_meta_data JSONB""")


def downgrade() -> None:
    op.execute("""ALTER TABLE DataSource,
               DROP COLUMN job_meta_data
               """)
