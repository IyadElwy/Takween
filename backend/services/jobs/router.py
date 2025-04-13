from datetime import datetime
from typing import Annotated

import requests
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from errors.exceptions import (
    DataSourceNotFoundException,
    InvalidFilterException,
    JobNotFoundException,
    ProjectNotFoundException,
    UnAuthorizedException,
    UserNotFoundException,
    ValidationException,
)
from errors.http import (
    DataSourceNotFoundError,
    InvalidSearchError,
    JobNotFoundError,
    ProjectNotFoundError,
    UnAuthorizedError,
    UserNotFoundError,
    ValidationError,
)
from models.jobs import Job
from validators.jobs import (
    check_valid_annotation_field,
    validate_create_job_body,
    validate_job_filter_request,
    validate_job_id,
    validate_ner_fields,
    validate_pos_fields,
    validate_text_classification_fields,
)


class CreateJobBody(BaseModel):
    type: str
    title: str
    project_id: int
    data_source_id: int
    annotation_field: str


class CreateTextClassificationBody(CreateJobBody):
    allow_multi_classification: bool
    classes: list[str]


class CreatePOSBody(CreateJobBody):
    tags: list[str]


class CreateNERBody(CreateJobBody):
    tags: list[str]


router = APIRouter()


async def is_authorized_for_create(
    request: Request, job_body: CreateTextClassificationBody | CreateNERBody | CreatePOSBody
) -> CreateTextClassificationBody | CreateNERBody | CreatePOSBody:
    try:
        current_user_id = int(request.state.user_id)
        bearer_token = request.state.bearer_token
        project_of_job = requests.get(
            f'http://localhost:5002/{job_body.project_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        if project_of_job.status_code == 404:
            raise ProjectNotFoundException()
        user_id_of_project_owner = project_of_job.json()['user_id_of_owner']
        current_user = requests.get(
            f'http://localhost:5003/{current_user_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        is_current_user_admin = current_user.json()['is_admin']
        if not is_current_user_admin and user_id_of_project_owner != current_user_id:
            raise UnAuthorizedException()
        return job_body
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except JobNotFoundException:
        raise JobNotFoundError()
    except UnAuthorizedException:
        raise UnAuthorizedError()
    except ProjectNotFoundException:
        raise ProjectNotFoundError()


async def is_authorized_for_delete(request: Request, job_id: int) -> int:
    try:
        validate_job_id(job_id)
        job = Job.get(request.state.config.db_conn, job_id)
        project_id_of_job = job.id
        bearer_token = request.state.bearer_token
        project_of_job = requests.get(
            f'http://localhost:5002/{project_id_of_job}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        user_id_of_project_owner = project_of_job.json()['user_id_of_owner']
        current_user_id = int(request.state.user_id)
        current_user = requests.get(
            f'http://localhost:5003/{current_user_id}',
            headers={'Authorization': f'Bearer {bearer_token}'},
        )
        is_current_user_admin = current_user.json()['is_admin']
        if not is_current_user_admin and user_id_of_project_owner != current_user_id:
            raise UnAuthorizedException()
        return job.id
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except JobNotFoundException:
        raise JobNotFoundError()
    except UnAuthorizedException:
        raise UnAuthorizedError()


@router.post('/')
async def create_job(
    request: Request,
    job_body: Annotated[
        CreateTextClassificationBody | CreateNERBody | CreatePOSBody, Depends(is_authorized_for_create)
    ],
):
    try:
        current_user_id = int(request.state.user_id)
        validate_create_job_body(job_body.title, job_body.project_id, current_user_id, job_body.data_source_id)
        check_valid_annotation_field(request.state.config.db_conn, job_body.annotation_field, job_body.data_source_id)
        job_meta_data = {
            'type': job_body.type,
        }

        match job_body.type:
            case 'TextClassification':
                validate_text_classification_fields(job_body.allow_multi_classification, job_body.classes)
                job_meta_data = {
                    **job_meta_data,
                    'allow_multi_classification': job_body.allow_multi_classification,
                    'classes': job_body.classes,
                }
            case 'NamedEntityRecognition':
                validate_ner_fields(job_body.tags)
                job_meta_data = {
                    **job_meta_data,
                    'tags': job_body.tags,
                }
            case 'PartOfSpeech':
                validate_pos_fields(job_body.tags)
                job_meta_data = {
                    **job_meta_data,
                    'tags': job_body.tags,
                }
            case _:
                raise ValidationException('Job type not valid')
        job = Job.create(
            request.state.config.db_conn,
            title=job_body.title,
            project_id=job_body.project_id,
            data_source_id=job_body.data_source_id,
            annotation_field=job_body.annotation_field,
            user_id_of_owner=current_user_id,
            job_meta_data=job_meta_data,
        )
        return job
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except DataSourceNotFoundException:
        raise DataSourceNotFoundError()
    except UserNotFoundException:
        raise UserNotFoundError()
    except ProjectNotFoundException:
        raise ProjectNotFoundError()


@router.get('/search')
async def get_all_jobs(
    request: Request,
    project_id: int | None = None,
    user_id_of_owner: int | None = None,
    creation_date: datetime | None = None,
    order_by: str | None = 'creation_date',
    sort_order: str | None = 'asc',
):
    try:
        validate_job_filter_request(
            order_by,
            sort_order,
            project_id=project_id,
            user_id_of_owner=user_id_of_owner,
            creation_date=creation_date,
        )
        jobs = Job.get_all(
            request.state.config.db_conn,
            order_by=order_by,
            sort_order=sort_order,
            project_id=project_id,
            user_id_of_owner=user_id_of_owner,
            creation_date=creation_date,
        )
        return jobs
    except InvalidFilterException as e:
        raise InvalidSearchError(e.message)


@router.get('/{job_id}')
async def get_job(request: Request, job_id: int):
    try:
        validate_job_id(job_id)
        job = Job.get(request.state.config.db_conn, job_id)
        return job
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except JobNotFoundException:
        raise JobNotFoundError()


@router.delete('/{job_id}')
async def delete_job(request: Request, job_id: Annotated[int, Depends(is_authorized_for_delete)]):
    try:
        validate_job_id(job_id)
        Job.delete(request.state.config.db_conn, job_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except JobNotFoundException:
        raise JobNotFoundError()
