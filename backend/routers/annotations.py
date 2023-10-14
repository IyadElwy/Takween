from fastapi import APIRouter, HTTPException
from models.models import Project
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv


load_dotenv()
username = os.getenv("MONGODB_USERNAME")
password = os.getenv("MONGODB_PASSWORD")
CONNECTION_URI = os.getenv("MONGODB_BASE_URI").replace(  # type: ignore
    "{MONGODB_USERNAME}", username).replace("{MONGODB_PASSWORD}", password)  # type: ignore

mongodb = pymongo.MongoClient(CONNECTION_URI)
mongodb = mongodb["annotations"]

router = APIRouter()


@router.get("/projects/{projectId}/jobs/{jobId}/annotations")
async def get_job_annotations(projectId, jobId, itemsPerPage: int, page: int,):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore

        starting_line = page * itemsPerPage

        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        data = collection.find().sort([('_id', pymongo.ASCENDING)]).skip(
            starting_line).limit(itemsPerPage)

        # line-count
        totalRowCount = 0
        if page == 0:
            totalRowCount = collection.count_documents({})

        return {
            "data": list(data),
            "totalRowCount": totalRowCount
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
