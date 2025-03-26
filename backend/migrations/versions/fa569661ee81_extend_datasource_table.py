"""
extend datasource table

Revision ID: fa569661ee81
Revises: 7573017b5094
Create Date: 2025-03-26 20:39:16.401930

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'fa569661ee81'
down_revision: str | None = '7573017b5094'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""ALTER TABLE DataSource ADD
               COLUMN creation_time TIMESTAMP,
               ADD COLUMN size INTEGER,
               ADD COLUMN type TEXT""")


def downgrade() -> None:
    op.execute("""ALTER TABLE DataSource,
               DROP COLUMN creation_time,
               DROP COLUMN size,
               DROP COLUMN type
               """)
