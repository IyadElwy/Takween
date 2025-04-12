import io

import polars as pl
from data_engine_utils import convert_to_parquet, return_annotatable_fields
from fastapi import Request
from fastapi.routing import APIRouter

from errors.exceptions import (
    ValidationException,
)
from errors.http import (
    ValidationError,
)
from utils.data import extract_file_type
from validators.data import validate_id

router = APIRouter()


@router.post('/datasource/initialize/{data_source_id}')
async def initialize_data_source(request: Request, data_source_id: int):
    try:
        validate_id(data_source_id)
        minio_client = request.state.config.minio_client
        data_source = minio_client.get_object('data', str(data_source_id))
        file_bytes = data_source.read()
        file_type = extract_file_type(file_bytes)
        if not file_type:
            return None
        df = convert_to_parquet(file_bytes, file_type)
        df.insert_column(0, pl.Series('__record_id', list(range(df.height))))
        parquet_file_io = io.BytesIO()
        df.write_parquet(parquet_file_io)
        parquet_file_io.seek(0)
        minio_client.put_object(
            'data-formatted', str(data_source_id), parquet_file_io, parquet_file_io.getbuffer().nbytes
        )
        return {'annotatable_fields': return_annotatable_fields(df), 'file_type': file_type}
    except ValidationException as e:
        raise ValidationError(e.validation_error)
