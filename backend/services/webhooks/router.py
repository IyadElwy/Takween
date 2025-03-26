from datetime import datetime

from fastapi import Request
from fastapi.routing import APIRouter

from errors.exceptions import ValidationException
from errors.http import ValidationError
from models.datasource import DataSource
from utils.data import get_file_type
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
        creation_time = datetime.strptime(data_source_upload_info['Records'][0]['eventTime'], '%Y-%m-%dT%H:%M:%S.%fZ')
        size = data_source_upload_info['Records'][0]['s3']['object']['size']
        data_source = DataSource.get_by_id(
            request.state.config.db_conn,
            int(data_source_id),
        )
        type = get_file_type(data_source.data_source_name) or 'Unknown'
        DataSource.update_status_to_ready(request.state.config.db_conn, int(data_source_id), creation_time, size, type)
    except ValidationException as e:
        raise ValidationError(e.validation_error)
