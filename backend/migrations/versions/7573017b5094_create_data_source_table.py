"""create_data_source_table

Revision ID: 7573017b5094
Revises: 51d5d84344b0
Create Date: 2024-08-18 20:02:45.447171

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '7573017b5094'
down_revision: Union[str, None] = '51d5d84344b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE DataSource(
                  id SERIAL UNIQUE,
                  project_id INTEGER NOT NULL REFERENCES Projects(id)
                    ON DELETE CASCADE,
                  user_id_of_owner INTEGER NOT NULL REFERENCES Users(id),
                  data_source_name TEXT NOT NULL,
                  chosen_field TEXT NOT NULL,
                  status TEXT NOT NULL
                    CHECK (status='ready' OR status='processing')
                    DEFAULT 'processing'
                  )""")


def downgrade() -> None:
    op.execute('DROP TABLE DataSource')
