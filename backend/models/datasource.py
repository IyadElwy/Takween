from __future__ import annotations

from datetime import datetime

from psycopg2.errors import ForeignKeyViolation, NoDataFound
from psycopg2.extensions import connection
from pydantic import BaseModel

from errors.exceptions import DataSourceNotFoundException, ProjectNotFoundException, UserNotFoundException


class DataSource(BaseModel):
    id: int
    project_id: int
    user_id_of_owner: int
    data_source_name: str
    status: str
    creation_time: datetime | None
    size: int | None
    type: str | None
    owner_email: str | None

    def __init__(
        self,
        id: int,
        project_id: int,
        user_id_of_owner: int,
        data_source_name: str,
        status: str,
        creation_time: datetime,
        size: int,
        type: str,
        owner_email: str,
    ) -> None:
        super().__init__(
            id=id,
            project_id=project_id,
            user_id_of_owner=user_id_of_owner,
            data_source_name=data_source_name,
            status=status,
            creation_time=creation_time,
            size=size,
            type=type,
            owner_email=owner_email,
        )

    @classmethod
    def create(cls, db_conn: connection, project_id: int, user_id_of_owner: int, data_source_name: str) -> DataSource:
        stmt = """INSERT INTO DataSource
                   (project_id, user_id_of_owner, 
                   data_source_name)
                   VALUES
                   (%s, %s, %s)
                   RETURNING id, project_id, user_id_of_owner, 
                   data_source_name, status, creation_time,
                   size, type"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(
                stmt,
                (project_id, user_id_of_owner, data_source_name),
            )
            data_source = DataSource(*(*cursor.fetchone(), None))
            db_conn.commit()
            cursor.close()
            return data_source
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            if 'user_id_of_owner' in err_msg:
                raise UserNotFoundException()
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def update_status_to_ready(
        cls, db_conn: connection, id: int, creation_time: datetime, size: int, type: str
    ) -> None:
        stmt = """UPDATE DataSource
                  SET status='ready',
                    creation_time=%s,
                    size=%s,
                    type=%s
                  WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (creation_time, size, type, id))
            db_conn.commit()
            cursor.close()
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def delete(cls, db_conn: connection, id: int) -> None:
        stmt = """DELETE FROM DataSource
                  WHERE id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            db_conn.commit()
            cursor.close()
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def get_by_id(cls, db_conn: connection, id: int) -> DataSource:
        stmt = """SELECT DataSource.id, DataSource.project_id, DataSource.user_id_of_owner,
                   DataSource.data_source_name, DataSource.status, DataSource.creation_time,
                   DataSource.size, DataSource.type, Users.email
                   FROM DataSource INNER JOIN Users ON DataSource.user_id_of_owner=Users.id
                   WHERE DataSource.id=%s;"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (id,))
            data_source = cursor.fetchone()
            cursor.close()
            if not data_source:
                raise NoDataFound()
            return DataSource(*data_source)
        except NoDataFound:
            raise DataSourceNotFoundException()

    @classmethod
    def get_by_project(cls, db_conn: connection, project_id: int) -> list[DataSource]:
        stmt = """SELECT DataSource.id, DataSource.project_id, DataSource.user_id_of_owner,
                   DataSource.data_source_name, DataSource.status, DataSource.creation_time,
                   DataSource.size, DataSource.type, Users.email
                   FROM DataSource INNER JOIN Users ON DataSource.user_id_of_owner=Users.id
                   WHERE DataSource.project_id=%s;"""
        cursor = db_conn.cursor()
        cursor.execute(stmt, (project_id,))
        data_sources_res = cursor.fetchall()
        cursor.close()
        return [DataSource(*data_source) for data_source in data_sources_res]
