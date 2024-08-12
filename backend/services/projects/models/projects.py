from __future__ import annotations

from datetime import datetime
from psycopg2.extensions import connection
from psycopg2.errors import NoDataFound


class Project:
    def __init__(self, id: int, title: str, user_id_of_owner: int, description: str, creation_date: datetime) -> None:
        self.id = id
        self.title = title
        self.user_id_of_owner = user_id_of_owner
        self.description = description
        self.creation_date = creation_date

    @classmethod
    def create(cls, db_conn: connection, title: str, user_id_of_owner: int,
               description: str) -> Project:
        stmt = """INSERT INTO Projects
                        (title, user_id_of_owner, description)
                        VALUES
                        (%s, %s, %s)
                        RETURNING
                        id, title, user_id_of_owner, description, creation_date"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (title, user_id_of_owner,
                           description))
            project = cursor.fetchone()
            db_conn.commit()
            cursor.close()
            return Project(*project)
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def get(cls, db_conn: connection, id: int) -> Project:
        stmt = """SELECT * FROM Projects WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            project = cursor.fetchone()
            if not project:
                raise NoDataFound()
            cursor.close()
            return Project(*project)
        except NoDataFound:
            raise NoDataFound()

    @classmethod
    def get_all(cls, db_conn: connection, order_by: str = 'creation_date',
                sort_order: str = 'asc', **filters: dict[str, str | int]) -> list[Project]:
        stmt = """SELECT * FROM Projects"""
        params = []
        for i, (filter, value) in enumerate(filters.items()):
            if value:
                if i == 0:
                    stmt += " WHERE"
                stmt += f' {filter}=%s'
                if i < len(filters)-1:
                    stmt += ' AND'
                params.append(value)
        stmt += f' ORDER BY {order_by}'
        if sort_order == 'asc':
            stmt += ' asc'
        elif order_by == 'desc':
            stmt += ' desc'
        cursor = db_conn.cursor()

        cursor.execute(stmt, params)
        res = cursor.fetchall()
        cursor.close()
        return res

    @classmethod
    def delete(cls, db_conn: connection, id: int) -> None:
        stmt = """DELETE FROM Projects WHERE id=%s
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
            raise NoDataFound()
