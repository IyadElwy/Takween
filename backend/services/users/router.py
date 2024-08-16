from typing import Annotated

from errors import (
    InvalidFilterException,
    InvalidSearchError,
    UnAuthorizedError,
    UnAuthorizedException,
    UserNotFoundError,
    UserNotFoundException,
    ValidationError,
    ValidationException,
)
from fastapi import APIRouter, Depends, Request
from validators import (
    validate_user_filter_request,
    validate_user_id,
)

from models.user import User

router = APIRouter()


@router.get('/search')
async def get_all_users(
    request: Request,
    id: int | None = None,
    first_name: str | None = None,
    last_name: str | None = None,
    email: str | None = None,
    is_admin: bool | None = None,
    order_by: str | None = 'id',
    sort_order: str | None = 'asc',
    project_id_to_embed_user_assignments: int | None = None,
):
    try:
        validate_user_filter_request(
            order_by,
            sort_order,
            id=id,
            project_id_to_embed_user_assignments=project_id_to_embed_user_assignments,
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_admin=is_admin,
        )
        users = User.get_all(
            request.state.config.db_conn,
            order_by=order_by,
            sort_order=sort_order,
            project_id_to_embed_user_assignments=project_id_to_embed_user_assignments,
            id=id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_admin=is_admin,
        )
        return users
    except InvalidFilterException as e:
        raise InvalidSearchError(e.message)


@router.get('/currentuser')
async def get_current_user(request: Request):
    try:
        user_id = request.state.user_id
        validate_user_id(user_id)
        user = User.get_by_id(request.state.config.db_conn, user_id)
        return user
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()


@router.get('/{user_id}')
async def get_user(request: Request, user_id: int):
    try:
        validate_user_id(user_id)
        user = User.get_by_id(request.state.config.db_conn, user_id)
        return user
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()


async def is_authorized_for_delete(request: Request, user_id: int) -> int:
    try:
        validate_user_id(user_id)
        user = User.get_by_id(request.state.config.db_conn, user_id)
        current_user_id = int(request.state.user_id)
        if not user.is_admin and current_user_id != user.id:
            raise UnAuthorizedException()
        return user.id
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()
    except UnAuthorizedException:
        raise UnAuthorizedError()


@router.delete('/{user_id}')
async def delete_user(
    request: Request,
    user_id: Annotated[int, Depends(is_authorized_for_delete)],
):
    try:
        validate_user_id(user_id)
        User.delete(request.state.config.db_conn, user_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise UserNotFoundError()
