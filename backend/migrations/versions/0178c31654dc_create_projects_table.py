"""create projects table

Revision ID: 0178c31654dc
Revises: a9d5a68631a7
Create Date: 2024-08-12 16:28:11.336893

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '0178c31654dc'
down_revision: Union[str, None] = '506022dd518d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE Projects(
                id SERIAL UNIQUE,
                title TEXT NOT NULL,
                user_id_of_owner INTEGER NOT NULL,
                description TEXT,
                creation_date TIMESTAMP DEFAULT NOW() NOT NULL,
                FOREIGN KEY (user_id_of_owner) REFERENCES Users (id)
                )""")


def downgrade() -> None:
    op.execute('DROP TABLE Projects')
