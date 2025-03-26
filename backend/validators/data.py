from errors.exceptions import ValidationException


def validate_create_data_source_body(
    project_id: int,
    user_id: int,
    data_source_name: str,
):
    if not project_id:
        raise ValidationException('Project id must be provided')
    if project_id <= 0:
        raise ValidationException('Project id must be valid')

    if not user_id:
        raise ValidationException('User id must be provided')
    if user_id <= 0:
        raise ValidationException('User id must be valid')

    if not data_source_name:
        raise ValidationException('Data source name must be provided')


def validate_id(id: int):
    if type(id) is str:
        if not id.isnumeric():
            raise ValidationException('Datasource id must be valid')
        id = int(id)
    if not id:
        raise ValidationException('Datasource id must be provided')
    if id <= 0:
        raise ValidationException('Datasource id must be valid')
