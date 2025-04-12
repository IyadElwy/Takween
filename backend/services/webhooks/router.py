from datetime import datetime

import requests
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
        creation_time = datetime.strptime(data_source_upload_info['Records'][0]['eventTime'], '%Y-%m-%dT%H:%M:%S.%fZ')
        size = data_source_upload_info['Records'][0]['s3']['object']['size']
        data_engine_response = requests.post(f'http://127.0.0.1:5006/datasource/initialize/{data_source_id}')
        data_engine_response.raise_for_status()
        data_source_meta_data = data_engine_response.json()
        if not data_source_meta_data:
            DataSource.delete(request.state.config.db_conn, int(data_source_id))
            request.state.config.minio_client.remove_object('data', str(data_source_id))
            return
        annotatable_fields, file_type = data_source_meta_data['annotatable_fields'], data_source_meta_data['file_type']
        DataSource.update_status_to_ready(
            request.state.config.db_conn,
            int(data_source_id),
            creation_time,
            size,
            file_type or 'Unknown',
            annotatable_fields,
        )
    except ValidationException as e:
        raise ValidationError(e.validation_error)
