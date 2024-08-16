from datetime import datetime
from typing import Annotated

import requests
from errors import (
    InvalidFilterException,
    InvalidSearchError,
    ProjectNotFoundError,
    ProjectNotFoundException,
    UnAuthorizedError,
    UnAuthorizedException,
    UserNotFoundError,
    UserNotFoundException,
    ValidationError,
    ValidationException,
)
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from validators import (
    validate_create_project_body,
    validate_project_filter_request,
    validate_project_id,
    validate_user_id,
)

from models.projects import Project


class CreateProjectBody(BaseModel):
    title: str
    description: str


router = APIRouter()


@router.post('/')
async def create_project(request: Request, project_body: CreateProjectBody):
    try:
        current_user_id = int(request.state.user_id)
        validate_create_project_body(project_body.title, current_user_id)
        project = Project.create(
            request.state.config.db_conn,
            **{
                **project_body.model_dump(),
                'user_id_of_owner': current_user_id,
            },
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
    embed_users: bool | None = False,
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
            embed_users=embed_users,
            user_id_of_owner=user_id_of_owner,
            creation_date=creation_date,
        )
        return projects
    except InvalidFilterException as e:
        raise InvalidSearchError(e.message)


class UserIdAndProjectIdRequestBody(BaseModel):
    user_id: int
    project_id: int


class UpdateUserProjectPermissionsRequestBody(BaseModel):
    user_id: int
    project_id: int
    can_add_data: bool
    can_create_jobs: bool


async def is_authorized_to_edit_project_memberships(
    request: Request,
    request_body: UpdateUserProjectPermissionsRequestBody
    | UserIdAndProjectIdRequestBody,
):
    try:
        current_user_id = request.state.user_id
        validate_user_id(current_user_id)
        validate_project_id(request_body.project_id)
        project = Project.get(
            request.state.config.db_conn,
            request_body.project_id,
        )
        if int(current_user_id) != project.user_id_of_owner:
            raise UnAuthorizedException()
        return request_body
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UnAuthorizedException:
        raise UnAuthorizedError()


@router.post('/makeUserProjectMember')
async def make_user_project_member(
    request: Request,
    make_user_project_member_request_body: Annotated[
        UserIdAndProjectIdRequestBody,
        Depends(is_authorized_to_edit_project_memberships),
    ],
):
    try:
        current_user_id = request.state.user_id
        validate_user_id(current_user_id)
        validate_user_id(make_user_project_member_request_body.user_id)
        validate_project_id(make_user_project_member_request_body.project_id)
        Project.add_user_to_project(
            request.state.config.db_conn,
            **make_user_project_member_request_body.model_dump(),
        )
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
    except UserNotFoundException:
        raise UserNotFoundError()


@router.patch('/updateUserProjectPermissions')
async def update_user_project_permissions(
    request: Request,
    update_user_project_permissions_request_body: Annotated[
        UpdateUserProjectPermissionsRequestBody,
        Depends(is_authorized_to_edit_project_memberships),
    ],
):
    try:
        current_user_id = request.state.user_id
        validate_user_id(current_user_id)
        validate_user_id(update_user_project_permissions_request_body.user_id)
        validate_project_id(
            update_user_project_permissions_request_body.project_id
        )
        Project.update_user_project_permissions(
            request.state.config.db_conn,
            **update_user_project_permissions_request_body.model_dump(),
        )
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
    except UserNotFoundException:
        raise UserNotFoundError()


@router.post('/removeUserFromProject')
async def remove_user_as_member_from_project(
    request: Request,
    remove_user_as_member_from_project_request_body: Annotated[
        UserIdAndProjectIdRequestBody,
        Depends(is_authorized_to_edit_project_memberships),
    ],
):
    try:
        current_user_id = request.state.user_id
        validate_user_id(current_user_id)
        validate_user_id(
            remove_user_as_member_from_project_request_body.user_id
        )
        validate_project_id(
            remove_user_as_member_from_project_request_body.project_id
        )
        Project.remove_user_as_member_from_project(
            request.state.config.db_conn,
            **remove_user_as_member_from_project_request_body.model_dump(),
        )
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
    except UserNotFoundException:
        raise UserNotFoundError()


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


async def is_authorized_for_delete(request: Request, project_id: int):
    try:
        validate_project_id(project_id)
        project = Project.get(request.state.config.db_conn, project_id)
        current_user_id = int(request.state.user_id)
        bearer_token = request.state.bearer_token
        current_user = requests.get(
            f'http://localhost:5003/{current_user_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        is_current_user_admin = current_user.json()['is_admin']

        if (
            not is_current_user_admin
            and project.user_id_of_owner != current_user_id
        ):
            raise UnAuthorizedException()
        return project.id
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
    except UnAuthorizedException:
        raise UnAuthorizedError()


@router.delete('/{project_id}')
async def delete_project(
    request: Request,
    project_id: Annotated[int, Depends(is_authorized_for_delete)],
):
    try:
        validate_project_id(project_id)
        Project.delete(request.state.config.db_conn, project_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except ProjectNotFoundException:
        raise ProjectNotFoundError()
