from __future__ import annotations

from datetime import datetime

from errors import ProjectNotFoundException, UserNotFoundException
from psycopg2.errors import ForeignKeyViolation, NoDataFound, UniqueViolation
from psycopg2.extensions import connection


class Project:
    def __init__(
        self,
        id: int,
        title: str,
        user_id_of_owner: int,
        description: str,
        creation_date: datetime,
    ) -> None:
        self.id = id
        self.title = title
        self.user_id_of_owner = user_id_of_owner
        self.description = description
        self.creation_date = creation_date

    @classmethod
    def create(
        cls,
        db_conn: connection,
        title: str,
        user_id_of_owner: int,
        description: str,
    ) -> Project:
        stmt_create_project = """INSERT INTO Projects
                        (title, user_id_of_owner, description)
                        VALUES
                        (%s, %s, %s)
                        RETURNING
                        id, title, user_id_of_owner, description, creation_date"""

        stmt_create_joint_project_users = """INSERT INTO ProjectUsers
                                            (user_id, project_id, is_owner,
                                            can_add_data, can_create_jobs)
                                            VALUES
                                            (%s, %s, %s, %s, %s)"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(
                stmt_create_project, (title, user_id_of_owner, description)
            )
            project = cursor.fetchone()
            project_object = Project(*project)
            cursor.execute(
                stmt_create_joint_project_users,
                (user_id_of_owner, project_object.id, True, True, True),
            )
            db_conn.commit()
            cursor.close()
            return project_object
        except ForeignKeyViolation:
            db_conn.rollback()
            raise UserNotFoundException()

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
            raise ProjectNotFoundException()

    @classmethod
    def get_all(
        cls,
        db_conn: connection,
        order_by: str,
        sort_order: str,
        embed_users: bool,
        **filters: dict[str, str | int | datetime],
    ) -> list[Project]:
        stmt = (
            """SELECT
        Projects.id AS project_id,
        Projects.title AS project_title,
        Projects.user_id_of_owner AS user_id_of_owner,
        Projects.description AS project_description,
        Projects.creation_date AS project_creation_date,
        Users.first_name AS user_first_name,
        Users.last_name AS user_last_name,
        Users.email AS user_email
        FROM Projects INNER JOIN Users On 
        Projects.user_id_of_owner = Users.id"""
            if embed_users
            else """SELECT * FROM Projects"""
        )
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
        if embed_users:
            projects = [
                {
                    **vars(Project(*project[:5])),
                    'owner_first_name': project[5],
                    'owner_last_name': project[6],
                    'owner_email': project[7],
                }
                for project in res
            ]
        else:
            projects = [Project(*project) for project in res]
        cursor.close()
        return projects

    @classmethod
    def get_user_projects(cls, db_conn: connection, user_id: int) -> list[dict]:
        stmt = """SELECT
                Projects.id AS project_id,
                Projects.title AS project_title,
                Projects.creation_date AS project_creation_date,
                Projects.description AS project_description,
                Users.email AS user_email_of_owner,
                ProjectUsers.is_owner AS is_owner,
                ProjectUsers.can_add_data AS can_add_data,
                ProjectUsers.can_create_jobs AS can_create_jobs,
                (SELECT COUNT(*) FROM ProjectUsers WHERE project_id=Projects.id)
                AS project_member_count
                FROM Projects  
                INNER JOIN ProjectUsers
                ON
                Projects.id=ProjectUsers.project_id
                INNER JOIN Users
                ON
                Projects.user_id_of_owner=Users.id
                WHERE user_id=%s"""
        cursor = db_conn.cursor()
        cursor.execute(stmt, (user_id,))
        res = cursor.fetchall()
        projects = [
            {
                'project_id': project[0],
                'project_title': project[1],
                'project_creation_date': project[2],
                'project_description': project[3],
                'user_email_of_owner': project[4],
                'is_owner': project[5],
                'can_add_data': project[6],
                'can_create_jobs': project[7],
                'project_member_count': project[8],
            }
            for project in res
        ]
        return projects

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
            db_conn.rollback()
            raise ProjectNotFoundException()

    @classmethod
    def add_user_to_project(
        cls, db_conn: connection, user_id: int, project_id: int
    ):
        stmt = """INSERT INTO ProjectUsers
                                            (user_id, project_id, is_owner,
                                            can_add_data, can_create_jobs)
                                            VALUES
                                            (%s, %s, %s, %s, %s)"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (user_id, project_id, False, False, False))
            db_conn.commit()
            cursor.close()
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            elif 'user_id' in err_msg:
                raise UserNotFoundException()
        except UniqueViolation:
            db_conn.rollback()
            pass

    @classmethod
    def update_user_project_permissions(
        cls,
        db_conn: connection,
        user_id: int,
        project_id: int,
        can_add_data: bool,
        can_create_jobs: bool,
    ):
        stmt = """UPDATE ProjectUsers
                  SET 
                  can_add_data=%s,
                  can_create_jobs=%s
                  WHERE
                  user_id=%s AND project_id=%s
                  """
        try:
            cursor = db_conn.cursor()
            cursor.execute(
                stmt, (can_add_data, can_create_jobs, user_id, project_id)
            )
            db_conn.commit()
            cursor.close()
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            elif 'user_id' in err_msg:
                raise UserNotFoundException()

    @classmethod
    def remove_user_as_member_from_project(
        cls, db_conn: connection, user_id: int, project_id: int
    ):
        stmt = """DELETE FROM ProjectUsers
                  WHERE user_id=%s AND project_id=%s"""
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, (user_id, project_id))
            db_conn.commit()
            cursor.close()
        except ForeignKeyViolation as e:
            db_conn.rollback()
            err_msg = e.pgerror
            if 'project_id' in err_msg:
                raise ProjectNotFoundException()
            elif 'user_id' in err_msg:
                raise UserNotFoundException()
