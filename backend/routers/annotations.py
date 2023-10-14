from fastapi import APIRouter, HTTPException
from models.models import Project
import pandas as pd
import json

router = APIRouter()


@router.get("/projects/{projectId}/jobs/{jobId}/annotations")
async def get_job_annotations(projectId, jobId, itemsPerPage: int, page: int,):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore

        starting_line = page * itemsPerPage
        ending_line = (page * itemsPerPage) + itemsPerPage

        records = []
        with open(job.annotation_file_location, 'r') as annotation_file:
            for line_number, line in enumerate(annotation_file):
                if ending_line > line_number >= starting_line:
                    records.append(json.loads(line))

        data = pd.DataFrame(records)

        # line-count
        totalRowCount = 0
        if page == 0:
            with open(job.annotation_file_location, 'r') as file:
                totalRowCount = sum(1 for line in file if line.rstrip())

        return {
            "data": data.to_dict(orient='records'),
            "totalRowCount": totalRowCount
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
