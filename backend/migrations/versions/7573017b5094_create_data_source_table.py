"""
create_data_source_table

Revision ID: 7573017b5094
Revises: 51d5d84344b0
Create Date: 2024-08-18 20:02:45.447171

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '7573017b5094'
down_revision: str | None = '51d5d84344b0'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""CREATE TABLE DataSource(
                  id SERIAL UNIQUE,
                  project_id INTEGER NOT NULL REFERENCES Projects(id)
                    ON DELETE CASCADE,
                  user_id_of_owner INTEGER NOT NULL REFERENCES Users(id),
                  data_source_name TEXT NOT NULL,
                  status TEXT NOT NULL
                    CHECK (status='ready' OR status='processing')
                    DEFAULT 'processing'
                  )""")


def downgrade() -> None:
    op.execute('DROP TABLE DataSource')
