from __future__ import annotations

from psycopg2.errors import NoDataFound, UniqueViolation
from psycopg2.extensions import connection
from pydantic import BaseModel

from errors.exceptions import UniqueFieldException, UserNotFoundException


class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    hashed_password: str
    is_admin: bool

    def __init__(
        self,
        id: int,
        first_name: str,
        last_name: str,
        email: str,
        hashed_password: str,
        is_admin: bool,
    ) -> None:
        super().__init__(
            id=id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
            is_admin=is_admin,
        )

    @classmethod
    def create(
        cls,
        db_conn: connection,
        first_name: str,
        last_name: str,
        email: str,
        hashed_password: str,
        is_admin: bool = False,
    ):
        stmt = """INSERT INTO Users
                        (first_name, last_name, email, hashed_password, is_admin)
                        VALUES
                        (%s, %s, %s, %s, %s) 
                        RETURNING 
                        id, first_name, last_name, email, hashed_password, is_admin"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (first_name, last_name, email, hashed_password, is_admin))
            user = cursor.fetchone()
            db_conn.commit()
            cursor.close()
            return User(*user)
        except UniqueViolation:
            db_conn.rollback()
            raise UniqueFieldException('email')
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def get_by_email(cls, db_conn: connection, email: str) -> User:
        stmt = """SELECT * FROM Users WHERE email=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (email,))
            user = cursor.fetchone()
            if not user:
                raise NoDataFound()
            cursor.close()
            return User(*user)
        except NoDataFound:
            raise UserNotFoundException()
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def get_by_id(cls, db_conn: connection, id: int) -> User:
        stmt = """SELECT * FROM Users WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            user = cursor.fetchone()
            if not user:
                raise NoDataFound()
            cursor.close()
            return User(*user)
        except NoDataFound:
            raise UserNotFoundException()
        except Exception as e:
            db_conn.rollback()
            raise e
