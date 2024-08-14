"""create jobs table

Revision ID: 0fd475018c21
Revises: 0178c31654dc
Create Date: 2024-08-14 16:52:39.924769

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '0fd475018c21'
down_revision: Union[str, None] = '0178c31654dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE Jobs(
                id SERIAL UNIQUE,
                title TEXT NOT NULL,
                project_id INTEGER NOT NULL REFERENCES Projects (id) ON DELETE CASCADE,
                user_id_of_owner INTEGER NOT NULL REFERENCES Users (id) ON DELETE CASCADE,
                creation_date TIMESTAMP DEFAULT NOW() NOT NULL
                )""")


def downgrade() -> None:
    op.execute('DROP TABLE Jobs')
