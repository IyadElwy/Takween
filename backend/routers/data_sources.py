from fastapi import APIRouter
from fastapi import HTTPException, UploadFile, Form
from models.models import Project, FileDataSource
import pandas as pd
import json
from enums.file_types import parse_to_enum as parse_file_type_enum, FileType
from utils.files import get_file_type
from utils.data import get_json_sample_from_file


router = APIRouter()


@router.get("/projects/{projectId}/file-data-sources")
async def get_job_data_sources(projectId):
    try:
        project = await Project.get(id=projectId)
        file_data_sources = await project.file_data_sources.all()  # type: ignore
        file_data_sources_list = [dict(val) for val in file_data_sources]

        for data_source in file_data_sources_list:
            if data_source['file_type'] is FileType.CSV:
                df = pd.read_csv(data_source['location'], nrows=5)
                data_source['exampleData'] = {"headers": df.columns.to_list(),
                                              "data": df.to_dict(orient='records')}
            if data_source['file_type'] is FileType.JSON:
                with open(data_source['location'], 'r') as json_file:
                    json_data = json.load(json_file)
                    data_source['exampleData'] = get_json_sample_from_file(
                        json_data, depth=5, max_elements=1)

        return file_data_sources_list

    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/projects/{projectId}/file-data-sources")
async def add_job_data(projectId, files: list[UploadFile] = Form(...)):
    try:
        project = await Project.get(id=projectId)
        created_file_data_sources = []
        for file in files:
            file_type = get_file_type(file.filename)  # type: ignore
            file_name = f'{file.filename.lower().replace(" ", "-").replace(".", "").replace(file_type, "")}'
            file_location = f"data/{projectId}-{file_name}.{file_type}"

            with open(file_location, "wb") as f:
                f.write(file.file.read())

            created_file_data_source = await FileDataSource.create(file_name=file_name,
                                                                   file_type=parse_file_type_enum(
                                                                       file_type),  # type: ignore
                                                                   location=file_location,
                                                                   size=file.file.tell(),
                                                                   project=project,)

            created_file_data_sources.append(created_file_data_source)

        file_data_source = dict(created_file_data_source)  # type: ignore

        if file_data_source['file_type'] is FileType.CSV:
            df = pd.read_csv(file_data_source['location'], nrows=5)
            file_data_source['exampleData'] = {"headers": df.columns.to_list(),
                                               "data": df.to_dict(orient='records')}
        if file_data_source['file_type'] is FileType.JSON:
            with open(file_data_source['location'], 'r') as json_file:
                json_data = json.load(json_file)
                file_data_source['exampleData'] = get_json_sample_from_file(
                    json_data, depth=5, max_elements=1)

        return {
            "created_file_data_sources": file_data_source
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))
