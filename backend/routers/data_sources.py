from fastapi import APIRouter, Request
from fastapi import HTTPException, UploadFile, Form
from models.models import Project, FileDataSource, User
import pandas as pd
import json
from enums.file_types import parse_to_enum as parse_file_type_enum, FileType
from utils.files import get_file_type
from utils.data import (get_json_sample_from_file,
                        convert_csv_to_json_and_save,
                        convert_ndjson_to_json_and_save,
                        convert_tsv_to_json_and_save)
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/projects/{projectId}/file-data-sources")
async def get_project_data_sources(projectId, request: Request):
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
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{projectId}/file-data-sources/{data_source_id}")
async def download_project(projectId, data_source_id):
    try:
        data_source = await FileDataSource.filter(id=data_source_id).first()
        print(data_source.location)
        return FileResponse(data_source.location, headers={"Content-Disposition": f"attachment; filename=data.json"})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects/{projectId}/file-data-sources")
async def add_project_data(projectId, request: Request, files: list[UploadFile] = Form(...)):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)

        project = await Project.get(id=projectId)
        created_file_data_sources = []
        for file in files:
            file_type = get_file_type(file.filename)  # type: ignore
            file_name = f'{file.filename.lower().replace(" ", "-").replace(".", "").replace(file_type, "")}'  # noqa: E501 # type: ignore
            file_location = f"data/{projectId}-{file_name}.{file_type}"

            with open(file_location, "wb") as f:
                f.write(file.file.read())
            if file_type == 'csv':
                file_location = convert_csv_to_json_and_save(
                    file_location)
            elif file_type == 'tsv':
                file_location = convert_tsv_to_json_and_save(
                    file_location)
                file_type = 'json'
            elif file_type == 'ndjson' or file_type == 'jsonl':
                file_location = convert_ndjson_to_json_and_save(file_location)
                file_type = 'json'
            elif file_type == 'json':
                pass
            else:
                raise Exception("File type not supported")

            created_file_data_source = await FileDataSource.create(file_name=file_name,
                                                                   file_type=parse_file_type_enum(
                                                                       file_type),  # type: ignore
                                                                   location=file_location,
                                                                   size=file.file.tell(),
                                                                   project=project,
                                                                   created_by=user)

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
        raise HTTPException(status_code=400, detail=str(e))
