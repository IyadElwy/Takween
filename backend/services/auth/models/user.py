from __future__ import annotations

from psycopg2.extensions import connection
from psycopg2.errors import UniqueViolation, NoDataFound
from errors import UniqueFieldException, UserNotFoundException


class User:
    def __init__(self, id: int, first_name: str, last_name: str, email: str, hashed_password: str, is_admin: bool) -> None:
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.hashed_password = hashed_password
        self.is_admin = is_admin

    @classmethod
    def create(cls, db_conn: connection, first_name: str, last_name: str, email: str, hashed_password: str, is_admin: bool = False):
        stmt = """INSERT INTO Users
                        (first_name, last_name, email, hashed_password, is_admin) 
                        VALUES
                        (%s, %s, %s, %s, %s) 
                        RETURNING 
                        id, first_name, last_name, email, hashed_password, is_admin"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (first_name, last_name,
                                  email, hashed_password, is_admin))
            user = cursor.fetchone()
            db_conn.commit()
            cursor.close()
            id, first_name, last_name, email, hashed_password, is_admin = user
            return User(id, first_name, last_name, email, hashed_password, is_admin)
        except UniqueViolation:
            db_conn.rollback()
            raise UniqueFieldException('email')

    @classmethod
    def get_by_email(cls, db_conn: connection, email: str) -> User:
        stmt = """SELECT * FROM Users WHERE email=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt,  (email,))
            user = cursor.fetchone()
            if not user:
                raise NoDataFound()
            id, first_name, last_name, email, hashed_password, is_admin = user
            cursor.close()
            return User(id, first_name, last_name, email, hashed_password, is_admin)
        except NoDataFound:
            raise UserNotFoundException()

    @classmethod
    def get_by_id(cls, db_conn: connection, id: int) -> User:
        stmt = """SELECT * FROM Users WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            user = cursor.fetchone()
            if not user:
                raise NoDataFound()
            id, first_name, last_name, email, hashed_password, is_admin = user
            cursor.close()
            return User(id, first_name, last_name, email, hashed_password, is_admin)
        except NoDataFound:
            raise UserNotFoundException()
