"""
extend job with data_source_id and annotation_field

Revision ID: b28c0bcf638d
Revises: 36fc5b0d4298
Create Date: 2025-04-12 19:18:47.624765

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b28c0bcf638d'
down_revision: str | None = '36fc5b0d4298'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""ALTER TABLE Jobs ADD
               COLUMN data_source_id INTEGER NOT NULL,
               ADD COLUMN annotation_field TEXT NOT NULL""")


def downgrade() -> None:
    op.execute("""ALTER TABLE DataSource,
               DROP COLUMN data_source_id,
               DROP COLUMN annotation_field
               """)
