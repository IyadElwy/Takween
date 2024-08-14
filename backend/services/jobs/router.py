from datetime import datetime

from errors import (
    InvalidFilterException,
    InvalidSearchError,
    JobNotFoundError,
    JobNotFoundException,
    ProjectNotFoundError,
    ProjectNotFoundException,
    UserNotFoundError,
    UserNotFoundException,
    ValidationError,
    ValidationException,
)
from fastapi import APIRouter, Request
from pydantic import BaseModel
from validators import (
    validate_create_job_body,
    validate_job_filter_request,
    validate_job_id,
)

from models.jobs import Job


class CreateJobBody(BaseModel):
    title: str
    project_id: int
    user_id_of_owner: int


router = APIRouter()


@router.post('/')
async def create_job(request: Request, job_body: CreateJobBody):
    try:
        validate_create_job_body(
            job_body.title, job_body.project_id, job_body.user_id_of_owner
        )
        job = Job.create(request.state.config.db_conn, **job_body.model_dump())
        return job
    except ValidationException as e:
        raise ValidationError(e.validation_error)
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
async def delete_job(request: Request, job_id: int):
    try:
        validate_job_id(job_id)
        Job.delete(request.state.config.db_conn, job_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except JobNotFoundException:
        raise JobNotFoundError()
