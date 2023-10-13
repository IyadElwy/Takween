from fastapi import APIRouter, HTTPException
from models.models import Project


router = APIRouter()


@router.get("/projects/{projectId}/jobs/{jobId}/annotations")
async def get_job_annotations(projectId, jobId, itemsPerPage: int, page: int,):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore

        data = await job.Annotations.all().limit(itemsPerPage).offset(page * itemsPerPage)
        totalRowCount = await job.Annotations.all().count()

        return {
            "data": data,
            "totalRowCount": totalRowCount
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
