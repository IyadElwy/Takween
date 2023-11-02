from fastapi import APIRouter, Request
from fastapi import HTTPException
from data_processors import (diacriticsRemoval, duplicateRemoval,
                             flattening, merging, punctuationRemoval,
                             stopWordRemoval, textAnonymization,
                             tokenizing)
import uuid
from utils.data import convert_ndjson_to_json_and_save
from enums.file_types import parse_to_enum as parse_file_type_enum
from models.models import FileDataSource, User, Project
import os

router = APIRouter()


@router.post("/data-processing")
async def process_data(request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)
        job_data = await request.json()
        project_id = job_data['projectId']
        project = await Project.filter(id=project_id).first()
        processing_type = job_data['processingType']
        data_name = job_data['title']
        file_path = f'data/{processing_type}-{data_name}-{uuid.uuid4()}.ndjson'

        match processing_type:
            case 'diacriticsRemoval':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                diacriticsRemoval.process_diacritics_removal(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'duplicateRemoval':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                duplicateRemoval.process_duplicate_removal(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'flattening':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                flattening.process_flattening(
                    job_data, file_path, original_datasource_path.location)
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'merging':
                original_datasource_paths = []
                for ds_id in job_data['dataSourceIds']:
                    curr_data_source = await FileDataSource.filter(id=ds_id).first()
                    original_datasource_paths.append(
                        curr_data_source.location)  # type: ignore
                field_to_process = job_data['fieldToProcess']
                merging.process_merging(
                    job_data, file_path, original_datasource_paths, field_to_process)
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'punctuationRemoval':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                punctuationRemoval.process_punctuation_removal(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'stopWordRemoval':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                stopWordRemoval.process_stop_word_removal(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'textAnonymization':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                textAnonymization.process_text_anonymization(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source
            case 'tokenizing':
                original_datasource_path = await FileDataSource.filter(id=job_data['dataSourceId']).first()
                field_to_process = job_data['fieldToProcess']
                tokenizing.process_tokenizing(
                    job_data, file_path, original_datasource_path.location, field_to_process)  # type: ignore
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{processing_type}-{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
