"""create users table

Revision ID: 506022dd518d
Revises: 
Create Date: 2024-08-11 17:23:46.610442

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '506022dd518d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE Users(
                id INTEGER PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                hashed_password TEXT NOT NULL
                    )""")


def downgrade() -> None:
    op.execute("DROP TABLE Users")
