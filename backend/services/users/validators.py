from errors import InvalidFilterException, ValidationException


def validate_user_id(user_id: int) -> None:
    if not user_id:
        raise ValidationException('user id must be provided')
    if user_id <= 0:
        raise ValidationException('user id must be valid')


def validate_user_filter_request(
    order_by: str, sort_order: str, **filters: dict[str, str | int]
) -> None:
    permitted_filters = ['id', 'first_name', 'last_name', 'email', 'is_admin']
    for filter in filters:
        if filter not in permitted_filters:
            raise InvalidFilterException(
                f'Field "{filter}" is not a valid query parameter'
            )

    permitted_order_filters = [
        'id',
        'first_name',
        'last_name',
        'email',
        'is_admin',
    ]
    if order_by not in permitted_order_filters:
        raise InvalidFilterException(
            f'Field "{order_by}" cannot be used to order by'
        )
    if sort_order not in ['asc', 'desc']:
        raise InvalidFilterException(
            'Sort ordering is either by asc or desc order'
        )
