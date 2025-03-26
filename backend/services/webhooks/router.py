from fastapi import Request
from fastapi.routing import APIRouter

from errors.exceptions import ValidationException
from errors.http import ValidationError
from models.datasource import DataSource
from validators.data import validate_id

router = APIRouter()


@router.post('/datasource/upload/complete')
async def data_source_upload_completed(
    request: Request,
):
    data_source_upload_info = await request.json()
    try:
        data_source_id = data_source_upload_info['Key'].strip('data/')
        validate_id(data_source_id)
        DataSource.update_status_to_ready(request.state.config.db_conn, data_source_id)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
