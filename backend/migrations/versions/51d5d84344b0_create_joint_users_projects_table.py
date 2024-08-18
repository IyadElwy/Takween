"""create_joint_users_projects_table

Revision ID: 51d5d84344b0
Revises: 0fd475018c21
Create Date: 2024-08-16 20:10:37.743921

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '51d5d84344b0'
down_revision: Union[str, None] = '0fd475018c21'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE ProjectUsers (
                user_id INTEGER REFERENCES Users(id)
                ON DELETE CASCADE NOT NULL,
                project_id INTEGER REFERENCES Projects(id)
                ON DELETE CASCADE NOT NULL,
                is_owner BOOLEAN NOT NULL,
                can_add_data BOOLEAN NOT NULL,
                can_create_jobs BOOLEAN NOT NULL,
                PRIMARY KEY (user_id, project_id)
        )""")


def downgrade() -> None:
    op.execute('DROP TABLE ProjectUsers')
