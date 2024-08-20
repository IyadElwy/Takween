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
        project_id_to_embed_user_assignments: bool,
        **filters: dict[str, str | int],
    ) -> list[User]:
        stmt = (
            """SELECT 
                Users.id, 
                Users.first_name, 
                Users.last_name, 
                Users.email,
                Users.is_admin, 
                ProjectUsers.project_id, 
                ProjectUsers.is_owner, 
                ProjectUsers.can_add_data, 
                ProjectUsers.can_create_jobs
            FROM 
                Users
            LEFT JOIN 
                ProjectUsers 
            ON 
                Users.id = ProjectUsers.user_id AND ProjectUsers.project_id = %s"""
            if project_id_to_embed_user_assignments
            else (
                """SELECT id, first_name, last_name, email, is_admin FROM Users"""
            )
        )
        params = (
            [project_id_to_embed_user_assignments]
            if project_id_to_embed_user_assignments
            else []
        )
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
        try:
            cursor = db_conn.cursor()
            cursor.execute(stmt, params)
            res = cursor.fetchall()
            if project_id_to_embed_user_assignments:
                users = [
                    {
                        **vars(User(*user[:5])),
                        'project_id': user[5],
                        'is_owner': user[6],
                        'can_add_data': user[7],
                        'can_create_jobs': user[8],
                    }
                    for user in res
                ]
            else:
                users = [User(*user) for user in res]
            cursor.close()
            return users
        except Exception as e:
            db_conn.rollback()
            raise e

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
        except Exception as e:
            db_conn.rollback()
            raise e
