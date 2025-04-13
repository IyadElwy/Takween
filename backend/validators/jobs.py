from datetime import datetime

from psycopg2.extensions import connection

from errors.exceptions import (
    DataSourceNotFoundException,
    InvalidFilterException,
    ValidationException,
)
from models.datasource import DataSource


def validate_job_id(job_id: int) -> None:
    if not job_id:
        raise ValidationException('job id must be provided')
    if job_id <= 0:
        raise ValidationException('job id must be valid')


def validate_create_job_body(title: str, project_id: int, user_id_of_owner: int, data_source_id: int) -> None:
    if not title:
        raise ValidationException('title must not be empty')
    if len(title) > 50:
        raise ValidationException('title length must not exceed 50 characters')

    if not project_id:
        raise ValidationException('project id must be provided')
    if project_id <= 0:
        raise ValidationException('project id must be valid')

    if not user_id_of_owner:
        raise ValidationException('user id of owner must be provided')
    if user_id_of_owner <= 0:
        raise ValidationException('user id of owner must be valid')

    if data_source_id <= 0:
        raise ValidationException('data source id must be valid')


def validate_job_filter_request(order_by: str, sort_order: str, **filters: dict[str, str | int | datetime]) -> None:
    permitted_filters = [
        'project_id',
        'user_id_of_owner',
        'creation_date',
    ]
    for filter in filters:
        if filter not in permitted_filters:
            raise InvalidFilterException(f'Field "{filter}" is not a valid query parameter')

    permitted_order_filters = [
        'title',
        'project_id',
        'user_id_of_owner',
        'creation_date',
    ]
    if order_by not in permitted_order_filters:
        raise InvalidFilterException(f'Field "{order_by}" cannot be used to order by')
    if sort_order not in ['asc', 'desc']:
        raise InvalidFilterException('Sort ordering is either by asc or desc order')


def validate_text_classification_fields(allow_multi_classification: bool, classes: list[str]):
    if not isinstance(allow_multi_classification, bool):
        raise ValidationException('allow_multi_classification must be valid boolean')
    if not isinstance(classes, list):
        raise ValidationException('classes must be a valid list of strings')
    for c in classes:
        if not isinstance(c, str):
            raise ValidationException('classes must be a valid list of strings')


def check_valid_annotation_field(db_conn: connection, annotation_field: str, data_source_id: int):
    try:
        data_source = DataSource.get_by_id(db_conn, data_source_id)
        if annotation_field not in data_source.annotatable_fields:
            raise ValidationException('Invalid annotation field')
    except DataSourceNotFoundException:
        raise


def validate_ner_fields(tags: list[str]):
    if not isinstance(tags, list):
        raise ValidationException('Invalid tags field')
    for t in tags:
        if not isinstance(t, str):
            raise ValidationException('Invalid tags field')


def validate_pos_fields(tags: list[str]):
    if not isinstance(tags, list):
        raise ValidationException('Invalid tags field')
    for t in tags:
        if not isinstance(t, str):
            raise ValidationException('Invalid tags field')
