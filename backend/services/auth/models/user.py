from __future__ import annotations
from sqlalchemy import Connection, text
from sqlalchemy.exc import IntegrityError, NoResultFound

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
    def create(cls, db_conn: Connection, first_name: str, last_name: str, email: str, hashed_password: str, is_admin: bool = False):
        stmt = text("""INSERT INTO Users
                        (first_name, last_name, email, hashed_password, is_admin) 
                        VALUES
                        (:FIRST_NAME, :LAST_NAME, :EMAIL, :HASHED_PASSWORD, :IS_ADMIN)""")
        try:
            db_conn.execute(stmt, {
                'FIRST_NAME': first_name,
                'LAST_NAME': last_name,
                'EMAIL': email,
                'HASHED_PASSWORD': hashed_password,
                'IS_ADMIN': is_admin})
            db_conn.commit()
            user = cls.get_by_email(db_conn, email)
            return user
        except IntegrityError:
            db_conn.rollback()
            raise UniqueFieldException('email')

    @classmethod
    def get_by_email(cls, db_conn: Connection, email: str) -> User:
        stmt = text("""SELECT * FROM Users
                        WHERE email=:email""")
        try:
            result = db_conn.execute(stmt, {"email": email}).first()
            if not result:
                raise NoResultFound()
            id, first_name, last_name, email, hashed_password, is_admin = result
            return User(id, first_name, last_name, email, hashed_password, is_admin)
        except NoResultFound:
            raise UserNotFoundException()

    @classmethod
    def get_by_id(cls, db_conn: Connection, id: int) -> User:
        stmt = text("""SELECT * FROM Users
                        WHERE id=:id""")
        try:
            result = db_conn.execute(stmt, {"id": id}).first()
            if not result:
                raise NoResultFound()
            id, first_name, last_name, email, hashed_password, is_admin = result
            return User(id, first_name, last_name, email, hashed_password, is_admin)
        except NoResultFound:
            raise UserNotFoundException()
