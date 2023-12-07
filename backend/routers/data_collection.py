from fastapi import APIRouter, Request
from fastapi import HTTPException
from data_extractors.youtube_api import extract_data_from_youtube_api
from data_extractors.wikipedia import extract_data_from_wikipedia
import uuid
from utils.data import convert_ndjson_to_json_and_save
from enums.file_types import parse_to_enum as parse_file_type_enum
from models.models import FileDataSource, User, Project
import os

router = APIRouter()


@router.post("/data-collection")
async def collect_data(request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)
        job_data = await request.json()
        job_type = job_data['extractionType']
        project_id = job_data['projectId']
        project = await Project.filter(id=project_id).first()
        data_name = job_data['title']
        match job_type:
            case 'youtube':
                file_path = f'data/youtube-{data_name}-{uuid.uuid4()}.ndjson'
                extract_data_from_youtube_api(
                    job_data, file_path)
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{data_name}',
                                                                       file_type=parse_file_type_enum(
                                                                           'json'),
                                                                       location=file_location,
                                                                       size=os.path.getsize(
                                                                           file_location),
                                                                       project=project,
                                                                       created_by=user)
                return created_file_data_source

            case 'wikipedia':
                file_path = f'data/wikipedia-{data_name}-{uuid.uuid4()}.ndjson'
                extract_data_from_wikipedia(job_data, file_path)
                file_location = convert_ndjson_to_json_and_save(file_path)
                created_file_data_source = await FileDataSource.create(file_name=f'{data_name}',
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
