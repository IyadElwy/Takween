from typing import Annotated

import requests
import timedelta
from fastapi import Depends, Form, Request
from fastapi.routing import APIRouter

from errors.exceptions import (
    DataSourceNotFoundException,
    ProjectNotFoundException,
    UnAuthorizedException,
    UserNotFoundException,
    ValidationException,
)
from errors.http import (
    DataSourceNotFoundError,
    ProjectNotFoundError,
    UnAuthorizedError,
    UserNotFoundError,
    ValidationError,
)
from models.datasource import DataSource
from models.projects import Project
from validators.data import validate_create_data_source_body, validate_id

router = APIRouter()


def authorize_to_get_data_source(request: Request, project_id: int):
    try:
        current_user_id = int(request.state.user_id)
        # check if user in project users table
        project = Project.get_user_projects(request.state.config.db_conn, current_user_id, project_id)
        if not project:
            raise UnAuthorizedException()
        return project_id
    except UnAuthorizedException:
        raise UnAuthorizedError()


@router.get('/datasource/project/{project_id}')
async def get_data_sources_by_project_id(
    request: Request, project_id: Annotated[int, Depends(authorize_to_get_data_source)]
):
    try:
        validate_id(project_id)
        return DataSource.get_by_project(request.state.config.db_conn, project_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)


@router.get('/datasource/project/{projwwect_id}/{datasource_id}')
async def get_data_source(
    request: Request,
    project_id: Annotated[int, Depends(authorize_to_get_data_source)],
    data_source_id: int,
):
    try:
        validate_id(id)
        data_source = DataSource.get_by_id(request.state.config.db_conn, data_source_id)
        return data_source
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except DataSourceNotFoundException:
        raise DataSourceNotFoundError()


def authorize_to_create_new_datasource(
    request: Request,
    user_id: Annotated[int, Form()],
    project_id: Annotated[int, Form()],
) -> int:
    try:
        current_user_id = int(request.state.user_id)
        if user_id != current_user_id:
            raise UnAuthorizedException()
        bearer_token = request.state.bearer_token
        project = requests.get(
            f'http://127.0.0.1:5002/currentuserprojects?project_id={project_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        ).json()[0]
        user_can_add_data = project['can_add_data']
        if not user_can_add_data:
            raise UnAuthorizedException()
        return user_id
    except Exception:
        raise UnAuthorizedError()


@router.post('/datasource/init')
async def initialize_new_data_source(
    request: Request,
    user_id: Annotated[Annotated[int, Form()], Depends(authorize_to_create_new_datasource)],
    project_id: Annotated[int, Form()],
    data_source_name: Annotated[str, Form()],
):
    try:
        validate_create_data_source_body(project_id, user_id, data_source_name)
        data_source = DataSource.create(
            request.state.config.db_conn,
            project_id,
            user_id,
            data_source_name,
        )
        presigned_put_url = request.state.config.minio_client.presigned_put_object(
            'data', str(data_source.id), timedelta.Timedelta(hours=2)
        )
        return {'dataSourceId': str(data_source.id), 'presignedPutUrl': presigned_put_url}
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()
    except ProjectNotFoundException:
        raise ProjectNotFoundError()


def authorize_as_internal_system_op(request: Request, data_source_id: int) -> int:
    try:
        current_user_id = int(request.state.user_id)
        bearer_token = request.state.bearer_token
        current_user = requests.get(
            f'http://localhost:5003/{current_user_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        is_current_user_system = current_user.json()['first_name'] == 'system'
        if not is_current_user_system:
            raise UnAuthorizedException()
        return data_source_id
    except Exception:
        raise UnAuthorizedError()


@router.post('internal/finishedsavingnewdatasource')
def finished_saving_new_datasource(
    request: Request,
    data_source_id: Annotated[int, Depends(authorize_as_internal_system_op)],
):
    try:
        validate_id(data_source_id)
        DataSource.update_status_to_ready(request.state.config.db_conn, data_source_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)


@router.post('internal/errorwhilesavingnewdatasource')
def error_while_saving_new_data_source(
    request: Request,
    data_source_id: Annotated[int, Depends(authorize_as_internal_system_op)],
):
    try:
        validate_id(data_source_id)
        DataSource.delete(request.state.config.db_conn, data_source_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
