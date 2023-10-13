from fastapi import APIRouter
from fastapi import HTTPException
from models.models import Project


router = APIRouter()


@router.get("/projects/{id}/jobs")
async def get_project_jobs(id):
    try:
        project = await Project.get(id=id)
        jobs = await project.Jobs.all()  # type: ignore
        return {'jobs': jobs}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/projects/{projectId}/jobs/{jobId}")
async def get_project_job_by_id(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
        return {'job': job}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
