from __future__ import annotations

from errors import UserNotFoundException
from psycopg2.errors import NoDataFound
from psycopg2.extensions import connection


class User:
    def __init__(
        self,
        id: int,
        first_name: str,
        last_name: str,
        email: str,
        is_admin: bool,
    ) -> None:
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin

    @classmethod
    def get_by_id(cls, db_conn: connection, id: int) -> User:
        stmt = """SELECT id, first_name, last_name, email, is_admin FROM Users WHERE id=%s"""
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

    @classmethod
    def get_all(
        cls,
        db_conn: connection,
        order_by: str,
        sort_order: str,
        **filters: dict[str, str | int],
    ) -> list[User]:
        stmt = """SELECT * FROM Users"""
        params = []
        filters = {
            filter: value
            for filter, value in filters.items()
            if value is not None
        }
        for i, (filter, value) in enumerate(filters.items()):
            if value is not None:
                if 0 < i < len(filters):
                    stmt += ' AND'
                if i == 0:
                    stmt += ' WHERE'
                stmt += f' {filter}=%s'
                params.append(value)

        stmt += f' ORDER BY {order_by}'
        if sort_order == 'asc':
            stmt += ' ASC'
        elif sort_order == 'desc':
            stmt += ' DESC'
        cursor = db_conn.cursor()
        cursor.execute(stmt, params)
        res = cursor.fetchall()
        cursor.close()
        return res

    @classmethod
    def delete(cls, db_conn: connection, id: int) -> None:
        stmt = """DELETE FROM Users WHERE id=%s
                  RETURNING id"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            id = cursor.fetchone()
            if not id:
                raise NoDataFound()
            db_conn.commit()
            cursor.close()
        except NoDataFound:
            db_conn.rollback()
            raise UserNotFoundException()
