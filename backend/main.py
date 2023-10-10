from fastapi import FastAPI, HTTPException, Request, UploadFile, Form
from tortoise.contrib.fastapi import register_tortoise
from models.models import Project, Job, FileDataSource
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from enums.annotation_type import parse_to_enum
from enums.file_types import parse_to_enum as parse_file_type_enum, FileType
from utils.files import get_file_type
from utils.data_type_parsers import check_dtype


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_tortoise(
    app,
    db_url='sqlite://db.sqlite3',
    modules={'models': ['models.models']},
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.get("/projects")
async def get_all_projects():
    try:
        all_projects = await Project.all()
        return all_projects
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/projects")
async def create_project(data: Request):
    print(data)
    try:
        project_data = await data.json()

        created_project = await Project.create(
            author="admin",
            title=project_data.get('title'),
            description=project_data.get('description'))

        return {"message": "Item created successfully", "data": {
            "project": created_project,
        }}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/projects/{id}")
async def get_project_by_id(id):
    try:
        project = await Project.get(id=id)
        return {'project': project}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.put("/projects/{id}")
async def update_project(id, request: Request):
    try:
        data = await Project.get(id=id)
        updated_data = await request.json()

        for key, value in updated_data.items():
            setattr(data, key, value)

        await data.save()
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Item not found")


@app.get("/projects/{id}/jobs")
async def get_project_jobs(id):
    try:
        project = await Project.get(id=id)
        jobs = await project.Jobs.all()  # type: ignore
        return {'jobs': jobs}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/projects/{projectId}/jobs/{jobId}")
async def get_project_job_by_id(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
        return {'job': job}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/projects/{projectId}/jobs/{jobId}/data")
async def get_job_data(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
        file_data_sources = await job.file_data_sources.all()

        dfs = []
        columns = None
        for source in file_data_sources:
            df = pd.read_csv(source.location)
            columns = zip(list(df.dtypes.index), [
                check_dtype(x) for x in list(df.dtypes.values)])
            dfs.append(df)

        try:
            df = pd.concat(dfs, ignore_index=True)
            return {
                "columns": columns,
                "data": df.values.tolist()
            }

        except Exception as e:
            return {'message': f"error merging data-sources together| {e}", }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/projects/{projectId}/file-data-sources")
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

        return file_data_sources_list

    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/projects/{projectId}/file-data-sources")
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

        file_data_source = dict(created_file_data_source)

        if file_data_source['file_type'] is FileType.CSV:
            df = pd.read_csv(file_data_source['location'], nrows=5)
            file_data_source['exampleData'] = {"headers": df.columns.to_list(),
                                               "data": df.to_dict(orient='records')}

        return {
            "created_file_data_sources": file_data_source
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))
