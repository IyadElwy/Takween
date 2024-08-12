"""'is_admin' field and create default admin

Revision ID: a9d5a68631a7
Revises: 506022dd518d
Create Date: 2024-08-11 17:46:07.788336

"""
from typing import Sequence, Union

from alembic import op
import bcrypt
import os
from dotenv import load_dotenv

# revision identifiers, used by Alembic.
revision: str = 'a9d5a68631a7'
down_revision: Union[str, None] = '506022dd518d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""ALTER TABLE Users
                        ADD COLUMN is_admin BOOLEAN NOT NULL""")
    admin_password = "admin"
    load_dotenv()
    salt = os.getenv("SALT")
    hashed_admin_password = bcrypt.hashpw(
        admin_password.encode(), salt.encode()).decode('utf-8')
    op.execute(f"""INSERT INTO Users 
                        (first_name, last_name, email, hashed_password, is_admin) 
                        VALUES
                        ('ADMIN', 'ADMIN', 'admin@takween.com', '{hashed_admin_password}', true)""")


def downgrade() -> None:
    op.execute("""ALTER TABLE Users DROP COLUMN is_admin""")
