from typing import Annotated

import requests
from errors import (
    ProjectNotFoundError,
    ProjectNotFoundException,
    UnAuthorizedError,
    UnAuthorizedException,
    UserNotFoundError,
    UserNotFoundException,
    ValidationError,
    ValidationException,
)
from fastapi import Depends, Form, Request, UploadFile
from fastapi.routing import APIRouter
from validators import validate_create_data_source_body, validate_id

from models.datasource import DataSource

router = APIRouter()


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


@router.post('/')
def add_data_source(
    request: Request,
    file: UploadFile,
    project_id: Annotated[int, Form()],
    user_id: Annotated[
        Annotated[int, Form()], Depends(authorize_to_create_new_datasource)
    ],
    data_source_name: Annotated[str, Form()],
    chosen_field: Annotated[str, Form()],
):
    try:
        validate_create_data_source_body(
            file, project_id, user_id, data_source_name, chosen_field
        )
        data_source = DataSource.create(
            request.state.config.db_conn,
            project_id,
            user_id,
            data_source_name,
            chosen_field,
        )
        return data_source
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()
    except ProjectNotFoundException:
        raise ProjectNotFoundError()


def authorize_as_internal_system_op(
    request: Request, data_source_id: int
) -> int:
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
        DataSource.update_status_to_ready(
            request.state.config.db_conn, data_source_id
        )
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
