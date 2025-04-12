"""
add annotatable_fields to datasource

Revision ID: 36fc5b0d4298
Revises: fa569661ee81
Create Date: 2025-04-12 12:10:40.192559

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '36fc5b0d4298'
down_revision: str | None = 'fa569661ee81'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""ALTER TABLE DataSource ADD
               COLUMN annotatable_fields JSONB""")


def downgrade() -> None:
    op.execute("""ALTER TABLE DataSource,
               DROP COLUMN annotatable_fields
               """)
