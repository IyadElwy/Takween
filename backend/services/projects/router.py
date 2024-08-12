from fastapi import APIRouter, Request
from pydantic import BaseModel
from psycopg2.errors import NoDataFound

from models.projects import Project
from errors import ProjectNotFoundException


class CreateProjectBody(BaseModel):
    title: str
    user_id_of_owner: int
    description: str


router = APIRouter()


@router.post('/')
async def create_project(request: Request, project_body: CreateProjectBody):
    try:
        project = Project.create(request.state.config.db_conn,
                                 **project_body.model_dump())
        return project
    except Exception as e:
        raise e


@router.get('/filter')
async def get_all_projects(request: Request, user_id_of_owner: int | None = None,
                           sort_by: str | None = None, sort_order: str | None = None):
    try:
        projects = Project.get_all(request.state.config.db_conn,
                                   order_by=sort_by, sort_order=sort_order,
                                   user_id_of_owner=user_id_of_owner)
        return projects
    except Exception as e:
        raise e


@router.get('/{project_id}')
async def get_project(request: Request, project_id: int):
    try:
        project = Project.get(request.state.config.db_conn, project_id)
        return project
    except NoDataFound:
        raise ProjectNotFoundException()


@router.delete('/{project_id}')
async def delete_project(request: Request, project_id: int):
    try:
        Project.delete(request.state.config.db_conn, project_id)
    except NoDataFound:
        raise ProjectNotFoundException()
