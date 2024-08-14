from __future__ import annotations

from datetime import datetime

from errors import (
    JobNotFoundException,
    ProjectNotFoundException,
    UserNotFoundException,
)
from psycopg2.errors import ForeignKeyViolation, NoDataFound
from psycopg2.extensions import connection


class Job:
    def __init__(
        self,
        id: int,
        title: str,
        project_id: int,
        user_id_of_owner: int,
        creation_date: datetime,
    ) -> None:
        self.id = id
        self.title = title
        self.project_id = project_id
        self.user_id_of_owner = user_id_of_owner
        self.creation_date = creation_date

    @classmethod
    def create(
        cls,
        db_conn: connection,
        title: str,
        project_id: int,
        user_id_of_owner: int,
    ) -> Job:
        stmt = """INSERT INTO Jobs
                        (title, project_id, user_id_of_owner)
                        VALUES
                        (%s, %s, %s)
                        RETURNING
                        id, title, project_id, 
                        user_id_of_owner, creation_date"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (title, project_id, user_id_of_owner))
            job = cursor.fetchone()
            db_conn.commit()
            cursor.close()
            return Job(*job)
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            elif 'user_id_of_owner' in err_msg:
                raise UserNotFoundException()

    @classmethod
    def get(cls, db_conn: connection, id: int) -> Job:
        stmt = """SELECT * FROM Jobs WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            job = cursor.fetchone()
            if not job:
                raise NoDataFound()
            cursor.close()
            return Job(*job)
        except NoDataFound:
            raise JobNotFoundException()

    @classmethod
    def get_all(
        cls,
        db_conn: connection,
        order_by: str,
        sort_order: str,
        **filters: dict[str, str | int | datetime],
    ) -> list[Job]:
        stmt = """SELECT * FROM Jobs"""
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
        stmt = """DELETE FROM Jobs WHERE id=%s
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
            raise JobNotFoundException()
