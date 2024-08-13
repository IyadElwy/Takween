from datetime import datetime

from errors import ValidationException, InvalidFilterException


def validate_project_id(project_id: int) -> None:
    if not project_id:
        raise ValidationException('project id must be provided')
    if project_id <= 0:
        raise ValidationException('project id must be valid')


def validate_create_project_body(title: str, user_id_of_owner: int) -> None:
    if not title:
        raise ValidationException('title must not be empty')
    if len(title) > 50:
        raise ValidationException('title length must not exceed 50 characters')

    if not user_id_of_owner:
        raise ValidationException('user id of owner must be provided')
    if user_id_of_owner <= 0:
        raise ValidationException('user id of owner must be valid')


def validate_project_filter_request(
    order_by: str, sort_order: str, **filters: dict[str, str | int | datetime]
) -> None:
    permitted_filters = ['user_id_of_owner', 'creation_date']
    for filter in filters:
        if filter not in permitted_filters:
            raise InvalidFilterException(
                f'Field "{filter}" is not a valid query parameter'
            )

    permitted_order_filters = ['creation_date', 'user_id_of_owner', 'title']
    if order_by not in permitted_order_filters:
        raise InvalidFilterException(
            f'Field "{order_by}" cannot be used to order by'
        )
    if sort_order not in ['asc', 'desc']:
        raise InvalidFilterException(
            'Sort ordering is either by asc or desc order'
        )
