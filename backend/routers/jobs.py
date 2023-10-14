from fastapi import APIRouter
from fastapi import HTTPException, Request
from models.models import Project, TextClassificationJob, FileDataSource
import json

router = APIRouter()


@router.get("/projects/{id}/jobs")
async def get_project_jobs(id):
    try:
        project = await Project.get(id=id)
        jobs = await project.Jobs.all()  # type: ignore
        return {'jobs': jobs}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects/{id}/jobs")
async def create_job(id, request: Request):
    try:
        project = await Project.get(id=id)
        job_data = await request.json()
        file_data_source = await FileDataSource.get(id=job_data['dataSource']['id'])
        annotation_type = job_data['type']
        annotation_file_location = f"annotations/{job_data['name']}-{file_data_source.file_name}.ndjson"
        match annotation_type:
            case "textClassification":
                with open(file_data_source.location, 'r') as original_data:
                    json_data = json.load(original_data)
                    with open(annotation_file_location, 'a+') as annotation_file:
                        for index, record in enumerate(json_data):
                            annotation_record = {
                                "id": index,
                                "data": record,
                                "fieldToAnnotate": job_data['fieldToAnnotate'],
                                "classes": job_data['classes'],
                                "allowMultiClassification": job_data['allowMultiClassification'],
                                "annotations": [],
                            }
                            annotation_file.write(
                                json.dumps(annotation_record) + '\n')

                created_job = await TextClassificationJob.create(title=job_data['name'],
                                                                 project=project,
                                                                 file_data_source=file_data_source,
                                                                 annotation_file_location=annotation_file_location,
                                                                 field_to_annotate=job_data['fieldToAnnotate'],
                                                                 classes_list_as_string=str(
                                                                     job_data['classes']),
                                                                 allow_multi_classification=job_data['allowMultiClassification'])
                return created_job

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{projectId}/jobs/{jobId}")
async def get_project_job_by_id(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
        return {'job': job}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
