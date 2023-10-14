from fastapi import APIRouter
from fastapi import HTTPException, UploadFile, Form
from models.models import Project, FileDataSource
import pandas as pd
import json
from enums.file_types import parse_to_enum as parse_file_type_enum, FileType
from utils.files import get_file_type
from utils.data import get_json_sample_from_file, convert_csv_to_json_and_save, convert_ndjson_to_json_and_save


router = APIRouter()


@router.get("/projects/{projectId}/file-data-sources")
async def get_project_data_sources(projectId):
    try:
        project = await Project.get(id=projectId)
        file_data_sources = await project.file_data_sources.all()  # type: ignore
        file_data_sources_list = [dict(val) for val in file_data_sources]

        for data_source in file_data_sources_list:
            with open(data_source['location'], 'r') as json_file:
                json_data = json.load(json_file)
                data_source['exampleData'] = get_json_sample_from_file(
                    json_data, depth=5, max_elements=1)

        return file_data_sources_list

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects/{projectId}/file-data-sources")
async def add_project_data(projectId, files: list[UploadFile] = Form(...)):
    try:
        project = await Project.get(id=projectId)
        created_file_data_sources = []
        for file in files:
            file_type = get_file_type(file.filename)  # type: ignore
            file_name = f'{file.filename.lower().replace(" ", "-").replace(".", "").replace(file_type, "")}'
            file_location = f"data/{projectId}-{file_name}.{file_type}"

            with open(file_location, "wb") as f:
                f.write(file.file.read())
            if file_type == 'csv':
                file_location = convert_csv_to_json_and_save(
                    file_location)
                file_type = 'json'
            if file_type == 'ndjson' or file_type == 'jsonl':
                file_location = convert_ndjson_to_json_and_save(file_location)
                file_type = 'json'

            created_file_data_source = await FileDataSource.create(file_name=file_name,
                                                                   file_type=parse_file_type_enum(
                                                                       file_type),  # type: ignore
                                                                   location=file_location,
                                                                   size=file.file.tell(),
                                                                   project=project,)

            created_file_data_sources.append(created_file_data_source)

        file_data_source = dict(created_file_data_source)  # type: ignore

        with open(file_data_source['location'], 'r') as json_file:
            json_data = json.load(json_file)
            file_data_source['exampleData'] = get_json_sample_from_file(
                json_data, depth=5, max_elements=1)

        return {
            "created_file_data_sources": file_data_source
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
