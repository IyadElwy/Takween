from errors import ValidationException
from fastapi import UploadFile
from utils import get_file_type


def validate_create_data_source_body(
    file: UploadFile,
    project_id: int,
    user_id: int,
    data_source_name: str,
    chosen_field: str,
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

    if not file or file.size == 0:
        raise ValidationException('File must be provided')
    file_type = get_file_type(file.filename)
    permitted_file_types = ['csv', 'tsv', 'json']
    if file_type not in permitted_file_types:
        ValidationException('File type not supported')

    if not chosen_field:
        raise ValidationException('Chosen field must be provided')


def validate_id(id: int):
    if not id:
        raise ValidationException('Datasource id must be provided')
    if id <= 0:
        raise ValidationException('Datasource id must be valid')
