from datetime import datetime

from errors import (
    InvalidFilterException,
    InvalidSearchError,
    ProjectNotFoundError,
    ProjectNotFoundException,
    UserNotFoundError,
    UserNotFoundException,
    ValidationError,
    ValidationException,
)
from fastapi import APIRouter, Request
from pydantic import BaseModel
from validators import (
    validate_create_project_body,
    validate_project_filter_request,
    validate_project_id,
)

from models.projects import Project


class CreateProjectBody(BaseModel):
    title: str
    user_id_of_owner: int
    description: str


router = APIRouter()


@router.post('/')
async def create_project(request: Request, project_body: CreateProjectBody):
    try:
        validate_create_project_body(
            project_body.title, project_body.user_id_of_owner
        )
        project = Project.create(
            request.state.config.db_conn, **project_body.model_dump()
        )
        return project
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()


@router.get('/search')
async def get_all_projects(
    request: Request,
    user_id_of_owner: int | None = None,
    creation_date: datetime | None = None,
    order_by: str | None = 'creation_date',
    sort_order: str | None = 'asc',
):
    try:
        validate_project_filter_request(
            order_by,
            sort_order,
            user_id_of_owner=user_id_of_owner,
            creation_date=creation_date,
        )
        projects = Project.get_all(
            request.state.config.db_conn,
            order_by=order_by,
            sort_order=sort_order,
            user_id_of_owner=user_id_of_owner,
            creation_date=creation_date,
        )
        return projects
    except InvalidFilterException as e:
        raise InvalidSearchError(e.message)


@router.get('/{project_id}')
async def get_project(request: Request, project_id: int):
    try:
        validate_project_id(project_id)
        project = Project.get(request.state.config.db_conn, project_id)
        return project
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()


@router.delete('/{project_id}')
async def delete_project(request: Request, project_id: int):
    try:
        validate_project_id(project_id)
        Project.delete(request.state.config.db_conn, project_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
