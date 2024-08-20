"""create users table

Revision ID: 506022dd518d
Revises:
Create Date: 2024-08-11 17:23:46.610442

"""

import os
from typing import Sequence, Union

import bcrypt
from alembic import op
from dotenv import load_dotenv

# revision identifiers, used by Alembic.
revision: str = '506022dd518d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""CREATE TABLE Users(
                id SERIAL UNIQUE,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                hashed_password TEXT NOT NULL,
                is_admin BOOLEAN NOT NULL
                    )""")
    admin_password = 'admin'
    system_password = 'system'
    load_dotenv()
    salt = os.getenv('SALT')
    hashed_admin_password = bcrypt.hashpw(
        admin_password.encode(), salt.encode()
    ).decode('utf-8')
    hashed_system_password = bcrypt.hashpw(
        system_password.encode(), salt.encode()
    ).decode('utf-8')
    op.execute(f"""INSERT INTO Users 
                        (first_name, last_name, email, 
                        hashed_password, is_admin)
                        VALUES
                        ('ADMIN', 'ADMIN', 'admin@takween.com', 
                        '{hashed_admin_password}', true)""")
    op.execute(f"""INSERT INTO Users 
                        (first_name, last_name, email, 
                        hashed_password, is_admin)
                        VALUES
                        ('SYSTEM', '-', '-', 
                        '{hashed_system_password}', true)""")


def downgrade() -> None:
    op.execute('DROP TABLE Users')
