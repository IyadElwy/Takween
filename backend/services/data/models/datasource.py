from __future__ import annotations

from errors import ProjectNotFoundException, UserNotFoundException
from psycopg2.errors import ForeignKeyViolation
from psycopg2.extensions import connection


class DataSource:
    def __init__(
        self,
        id: int,
        project_id: int,
        user_id_of_owner: int,
        data_source_name: str,
        chosen_field: str,
        status: str,
    ) -> None:
        self.id = id
        self.project_id = project_id
        self.user_id_of_owner = user_id_of_owner
        self.data_source_name = data_source_name
        self.chosen_field = chosen_field
        self.status = status

    @classmethod
    def create(
        cls,
        db_conn: connection,
        project_id: int,
        user_id_of_owner: int,
        data_source_name: str,
        chosen_field: str,
    ) -> DataSource:
        stmt = """INSERT INTO DataSource
                   (project_id, user_id_of_owner, 
                   data_source_name, chosen_field)
                   VALUES
                   (%s, %s, %s, %s)
                   RETURNING id, project_id, user_id_of_owner, 
                   data_source_name, chosen_field, status"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(
                stmt,
                (project_id, user_id_of_owner, data_source_name, chosen_field),
            )
            data_source = DataSource(*cursor.fetchone())
            db_conn.commit()
            cursor.close()
            return data_source
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            elif 'user_id_of_owner' in err_msg:
                raise UserNotFoundException()
        except Exception as e:
            db_conn.rollback()
            raise e

    @classmethod
    def update_status_to_ready(cls, db_conn: connection, id: int) -> None:
        stmt = """UPDATE DataSource
                  SET status='ready'
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
